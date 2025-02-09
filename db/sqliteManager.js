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

        // Enable WAL mode. Improves performance
        await Database.instance.execAsync('PRAGMA journal_mode = WAL;');

        // Enforce foreign key contraints
        await Database.instance.execAsync('PRAGMA foreign_keys = ON;');

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


  async executeQuery (query, params) {
    try {
      console.log("Executing query ", query)

      const db = await this.db
      const result = await db.getAllAsync(query, params)

      console.log("Query rows:", result);
      
      return result
    } catch (error) {
      console.log("Failed to executeQuery", error)
      
    }
    
  }
}

export class HabitsRepository extends BaseRepository {

  async createHabit(data) {
    query = `--sql
    INSERT INTO Habits (name, setting, repeat, label, limitType, referenceGoal, color) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    params = data;

    /* Data array
        habitName,
        habitSetting,
        habitRepeat,
        habitLabel,
        habitLimit,
        habitGoal,
        selectedColor,
    */

    return this.executeQuery(query, params)
  }

  async initializeHabits(date) {
    try {

      const results = await this.queryHabits(date)
      console.log("CHECKPOINT 2")
      console.log("Results post C2:", results)
  
      await this.createLogs(results)

      console.log("CHECKPOINT 1")
  
      const history = await this.executeQuery(
        `SELECT * FROM HabitHistory`
      )
  
      console.log("HISTORY", history)
  
      const updatedResults = await this.queryHabits(date)
      
  
      //await checkDates(results)
  
      console.log("Fetched results:", updatedResults)
      return updatedResults
  
    } catch (error) {
      console.log("Error fetching habits:", error)
    }
  }

  
  async queryHabits(date) {
    const query = `
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

    return this.executeQuery(query, params)
  }

  async createLogs(habits) {
    for (let habit of habits) {
      console.log('Checkpoint 3')

      if (habit.date == null || await determineRepetition(habit.repeat, habit.date)) {
        console.log("No history", habit)

        const query = `--sql
          INSERT OR IGNORE INTO HabitHistory (habitId, completion, goal, date)
          VALUES (?, ?, ?, ?)
        `;
        
        const params = [
            habit.id,
            0,
            habit.referenceGoal,
            await dateToSQL(new Date())
        ]

        console.log("Query", query)
        console.log("Params", params)
      
        return this.executeQuery(query, params)
      }
    }
  }

}

async function determineRepetition(repeat, date) {

  const today = await dateToSQL(new Date());

  if (repeat === "day") {
    if (date.split('-')[2] != today.split('-')[2]) {
      console.log("DAYS NOT EQUAL: ", date.split('-')[2], today.split('-')[2])
      return true;
    }
  }
  else if (repeat === "week") {
    if (Math.floor(date.split('-')[2] / 7) != Math.floor(today.split('-')[2] / 7)) {
      console.log("returned true in weekly")
      return true;
    }
  }
  else if (repeat === "month") {
    if (date.split('-')[1] != today.split('-')[1]) {
      return true;
    }
  }
  else if (repeat === "year") {
    if (date.split('-')[0] != today.split('-')[0]) {
      return true;
    }
  }
  return false
}

export async function dateToSQL(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export async function setCompletion (db, id, value, date) {
  console.log("set completion", value)
  await db.runAsync(
    `UPDATE HabitHistory
    SET completion = ?
    WHERE habitId = ?
    `,
  [value ? value : 0, id]
  )
}

export async function getCompletion (db, id, date) {
  console.log("get completion")
  try {
    const results = await db.getAllAsync(
      `SELECT completion
      FROM HabitHistory
      WHERE habitId = ?
      AND date = (
        SELECT date
        FROM HabitHistory
        WHERE habitId = ?
        AND date <= ?
        ORDER BY date DESC
        LIMIT 1
      )`,
      [id, id, Date(date)]
      
    )

    console.log("completion history", results[0]['completion'])
    return results[0]['completion']
  } catch (error) {
    console.log("Failed to fetch completion history", error)
  }
}

export async function getHabitLabels (db) {
  try {
    const results = await db.getAllAsync(
      `SELECT name
      FROM HabitLabel`
    )
    
    console.log("Habit Labels: ", results)
    return results;
  }
  catch (error) {
    console.log("Failed to get habit labels", error)
  }
}

export async function getHabitLocations (db) {
  try {
    const results = await db.getAllAsync(
      `SELECT name
      FROM HabitLocation`
    )
    
    console.log("Habit Locations: ", results)
    return results;
  }
  catch (error) {
    console.log("Failed to get habit locations", error)
  }
}



export async function addHabitLabel (db, value) {
  try {
    db.runAsync(
      `INSERT INTO HabitLabel (name) VALUES (?)`,
      [value]
    )
  } catch (error) {
    console.log("Failed to add new label ", error)
  }
}


export async function addHabitLocation (db, value) {
  try {
    db.runAsync(
      `INSERT INTO HabitLocation (name) VALUES (?)`,
      [value]
    )
  } catch (error) {
    console.log("Failed to add new location ", error)
  }
}