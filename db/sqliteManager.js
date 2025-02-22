import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './createTables';


class Database {
  static instance = null;  // shared database instance across manager

  static async getInstance() {
    if (!Database.instance) { 
       // connects to DB if there is no connection
      try {
        //console.log("Creating Database instance")

        Database.instance = await SQLite.openDatabaseAsync('habits.db');

        await Database.instance.execAsync('PRAGMA journal_mode = WAL;'); // Enable WAL mode. Improves performance
        await Database.instance.execAsync('PRAGMA foreign_keys = ON;'); // Enforce foreign key contraints
        await Database.instance.execAsync(SCHEMA_SQL)

        //console.log("Successfully created Database instance")
      } catch (error) {
        console.log("Failed to initialize database: ", error)
      }

    }
    return Database.instance;
  }
}

class BaseRepository {
  constructor () {
    this.db = Database.getInstance();
  }
  
  async executeQuery (query, ...params) {
    //console.log("EQ, Query: ", query)
    //console.log("EQ, Params: ", params)

    try {
      const db = await this.db

      const result = await db.runAsync(query, ...params)

      return result
    } catch (error) {
      console.log("Failed to executeQuery", error)
    }
    
  }

  async getAllQuery (query, ...params) {
    try {
      const db = await this.db
      const result = await db.getAllAsync(query, ...params)

      //console.log("getAllQuery rows:", result);
      
      return result
    } catch (error) {
      console.log("Failed to getAllQuery", error)
      
    }
    
  }
  
}

export class DevRepository extends BaseRepository {
  async DropTables() {
    try {
      
      const db = await this.db
      await db.runAsync(`DELETE FROM HabitHistory`)
      await db.runAsync(`DELETE FROM Habits`)
      await db.runAsync(`DELETE FROM HabitLabel`)
      await db.runAsync(`DELETE FROM HabitLocation`)
      await db.runAsync(`DROP TABLE IF EXISTS Habits`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitHistory`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitLabel`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitLocation`)

      console.log("Successfuly dropped tables")
    } catch (error) {
      console.log("Failed to drop tables", error)
    }
  }

  async TestQuery() {
    const query = `SELECT * FROM HabitHistory`

    const result = await this.getAllQuery(query)

    console.log("SIMPLE QUERY RESULT", result)
    
    return result;
  }
}
export class HabitsRepository extends BaseRepository {

  async createHabit(data) {
    const query = `--sql
    INSERT INTO Habits (name, setting, repeat, label, limitType, referenceGoal, color, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = data;

    //console.log("Create Habit Params", params)

    /* Data array
        habitName,
        habitSetting,
        habitRepeat,
        habitLabel,
        habitLimit,
        habitGoal,
        selectedColor,
        habitLocation
    */

    try {
      await this.executeQuery(query, params)
    } catch (error) {
      console.log("Failed to insert habit")
    }
  }

  async initializeHabits(date) {

    console.log("initializeHabits date: ", date)
    try {

      const results = await this.queryHabits(date)
  
      await this.createLogs(results, date)

      const history = await this.getAllQuery( // FIX ME : REMOVE ME LATER
        `SELECT * FROM HabitHistory`
      )
      
      console.log("HABIT HISTORY: ", history) // UNCOMMENT
  
      const updatedResults = await this.queryHabits(date)
  
      //console.log("Fetched results:", updatedResults) //UNCOMMENT

      return updatedResults
    } catch (error) {
      console.log("Error fetching habits:", error)
    }
  }

  
  async queryHabits(date) {
    //console.log("Query date: ", date)

    const query = `--sql
      SELECT Habits.*, b.completion, b.goal, b.date
      FROM Habits
      LEFT JOIN HabitHistory AS b 
      ON Habits.id = b.habitId
      AND b.date = (
        SELECT date
        FROM HabitHistory
        WHERE HabitHistory.habitId = Habits.id
        AND date <= ?
        ORDER BY date DESC
        LIMIT 1
      )
    `
    const params = [
      date
    ]

    try {
      return this.getAllQuery(query, params)
    } catch (error) {
      console.log("Failed to retrieve habits ", error)
    }
  }

  async createLogs(habits, date) {
    console.log("createLogs date: ", date)

    for (let habit of habits) {

      //console.log("Habit Name: ", habit.name);
      
      if (habit.date == null || await determineRepetition(habit.repeat, habit.date, date)) {
        console.log("Couldn't find history OR the date doesn't match the history: ", habit)

        console.log("DATE", date)
        console.log("HABIT REPEAT", habit.repeat)

        let logCreationDate;
        switch (habit.repeat) {
          case "day":
            logCreationDate = date
            break
          case "week":
            logCreationDate = await dateToSQL(await startOfWeek(date))
            break
          case "month":
            logCreationDate = await dateToSQL(await startOfMonth(date))
            break
          case "year":
            logCreationDate = await dateToSQL(await startOfYear(date))
            break
          default:
            logCreationDate = date
        }

        console.log("LOG CREATION DATE ", logCreationDate)



        const query = `--sql
          INSERT OR IGNORE INTO HabitHistory (habitId, completion, goal, date)
          VALUES (?, ?, ?, ?)
        `;
        
        const params = [
            habit.id,
            0,
            habit.referenceGoal,
            logCreationDate
        ]
      
        try {
          this.executeQuery(query, params)
        }
        catch (error) {
          console.log("Failed to create habit log", error)
        }
      }
      else {
        //console.log("History already exists OR it the date matches previous history") // UNCOMMENT (Maybe)
      }
    }
  }
}

export class HabitHistoryRepository extends BaseRepository {
  async setCompletion (id, value, date) {
    //console.log("set completion", value)

    const query = `--sql
      UPDATE HabitHistory
      SET completion = ?
      WHERE habitId = ? 
      AND date = (
        SELECT date
        FROM HabitHistory
        WHERE habitId = ?
        AND date <= ?
        ORDER BY date DESC
        LIMIT 1
      )
    `

    const params = [value ? value : 0, id, id, date]

    //console.log("params", ...params)

    return this.executeQuery(query, params)
  }
  
  async getCompletion (id, date) {
    //console.log("get completion")

    const query = `--sql
      SELECT completion
      FROM HabitHistory
      WHERE habitId = ?
      AND date = (
        SELECT date
        FROM HabitHistory
        WHERE habitId = ?
        AND date <= ?
        ORDER BY date DESC
        LIMIT 1
      )
    `

    const params = [id, id, date]

    try {
      const results = await this.getAllQuery(query, params)
      //console.log("completion history", results[0]['completion'])
      return results[0]['completion']
    } catch (error) {
      console.log("Failed to fetch completion history", error)
    }
  }
}

export class HabitSettingRepository extends BaseRepository {

  async getHabitLabels () {
    const query = `--sql
      SELECT name
      FROM HabitLabel;
    `

    try {
      return this.getAllQuery(query);
    }
    catch (error) {
      console.log("Failed to get habit labels", error)
    }
  }
  
  async getHabitLocations () {
    const query = `--sql
      SELECT name
      FROM HabitLocation;
    `

    try {

      return this.getAllQuery(query);
    }
    catch (error) {
      console.log("Failed to get habit locations", error)
    }
  }
  
  addHabitLabel = async (value) => {
    const query = `--sql
      INSERT INTO HabitLabel (name) 
      VALUES (?);
    `

    const params = value

    try {
      await this.executeQuery(query, params)
      console.log("Successfully added label: ", params)
    } catch (error) {
      console.log("Failed to add new label ", error)
    }
  }
  
  
  addHabitLocation = async (value) => {
    const query = `--sql
      INSERT INTO HabitLocation (name)
      VALUES (?);
    `

    const params = value

    try {
      return this.executeQuery(query, params)
    } catch (error) {
      console.log("Failed to add new location ", error)
    }
  }
}

async function isInNextWeek(date, today) {
  const start1 = await startOfWeek(date);
  const start2 = await startOfWeek(today);

  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  console.log("Previous Date: ", start1);
  console.log("Current date: ", start2)
  console.log("Difference: ", start2 - start1)
  console.log("One week ms: ", oneWeekMs)

  
  // Checks if the difference is exactly 7 days (in milliseconds)
  return start2 - start1 == oneWeekMs;
}

const startOfWeek = async (date) => {
  const d = new Date(date);

  const day = d.getDay() === 0 ? 7 : d.getDay() // Treats Sunday (0) as 7
  d.setHours(0, 0, 0, 0); // Clears out all time values

  d.setDate(d.getDate() - (day - 1)); // Subtracts (day - 1) to get to Monday
  return d;
}

const startOfMonth = async (date) => {
  date = new Date(date)
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  return start
}

const startOfYear = async (date) => {
  date = new Date(date)
  const start = new Date(date.getFullYear(), 0, 1)
  return start
}

async function determineRepetition(repeat, date, selectedDate) {


  if (repeat === "day") {
    if (date.split('-')[2] != selectedDate.split('-')[2]) {
      return true;
    }
  }
  else if (repeat === "week") {
    if (await isInNextWeek(date, selectedDate)) {
      console.log("returned true in weekly")
      return true;
    }
  }
  else if (repeat === "month") {
    if (date.split('-')[1] != selectedDate.split('-')[1]) {
      return true;
    }
  }
  else if (repeat === "year") {
    if (date.split('-')[0] != selectedDate.split('-')[0]) {
      return true;
    }
  }
  return false
}

/**
 * Converts a standard JS Date() to the SQLite format YYYY-MM-DD
 * @param {*} date the JS Date()
 * @returns JS Date() in YYYY-MM-DD format
 */
export async function dateToSQL(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}



