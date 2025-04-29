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
    //console.log("EQ, Params: ", ...params)

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
      await db.runAsync(`DELETE FROM JournalEntries`)
      await db.runAsync(`DELETE FROM QuitHabits`)
      await db.runAsync(`DELETE FROM QuitHabitHistory`)
      await db.runAsync(`DROP TABLE IF EXISTS Habits`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitHistory`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitLabel`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitLocation`)
      await db.runAsync(`DROP TABLE IF EXISTS JournalEntries`)
      await db.runAsync(`DROP TABLE IF EXISTS QuitHabits`)
      await db.runAsync(`DROP TABLE IF EXISTS QuitHabitHistory`)

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

    /* Data array
        habitName,
        habitSetting,
        habitRepeat,
        habitLabel,
        habitLimit,
        habitGoal,
        selectedColor,
        habitLocation,
        currentStreak,
        highestStreak
    */

    try {
      await this.executeQuery(query, params)
    } catch (error) {
      console.log("Failed to insert habit")
    }
  }

  async initializeHabits(date) {
    date = await dateToSQL(date)

    try {
      const tallyHabits = await this.queryHabits(date)
      await this.createLogs(tallyHabits, date)

      const updatedTallyHabits = await this.queryHabits(date);
      const updatedQuitHabits = await new QuitHabitRepository().getAllHabits();

      const updatedResults = [...updatedTallyHabits, ...updatedQuitHabits]
      
      console.log("Habits\n" + JSON.stringify(updatedResults))

      return updatedResults
    } catch (error) {
      console.log("Error fetching habits:", error)
    }
  }

  async getAllHabits() {
    const query = `--sql
      SELECT name
      FROM Habits
    `

    const res = await this.getAllQuery(query, [])
    console.log("GET ALL RES: ", res)

    return res
  }
  
  async queryHabits(date) {
    date = await dateToSQL(date)

    const query = `--sql
      SELECT Habits.*, b.completionCount, b.goal, b.date, b.streak, b.completed
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

  async getPreviousLog(date) {
    date = await dateToSQL(date)

    const query = `--sql
      SELECT Habits.*, b.completionCount, b.goal, b.date, b.streak, b.completed
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
        OFFSET 1
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

  async createLogs(habits, currentDate) {

    currentDate = await dateToSQL(currentDate);
    
    for (let habit of habits) {
      const logDate = await convertDateByRepetition(habit.repeat, currentDate);

      const logDifference = await determineRepetition(habit.repeat, habit.date, logDate) 
      
      if (habit.date == null || logDifference > 0) {
        console.log("Couldn't find history OR the date doesn't match the history: ", habit)

        const streak = logDifference > 1 || !habit.completed ? 0 : habit.streak ?? 0

        const query = `--sql
          INSERT OR IGNORE INTO HabitHistory (habitId, completionCount, goal, date, streak)
          VALUES (?, ?, ?, ?, ?)
        `;

        const params = [
            habit.id,
            0,
            habit.referenceGoal,
            logDate,
            streak
        ]
      
        try {
          await this.executeQuery(query, params)
        }
        catch (error) {
          console.log("Failed to create habit log", error)
        }
      }
      /*else {
          
          console.log("UPDATING HABIT STREAK")
          const [prev] = await this.getPreviousLog(currentDate);

          const streak = !habit.completed ? (prev.completed ? prev.streak ?? 0 : 0) : (prev.completed ? prev.streak + 1 : habit.streak)

          console.log("Already existing diff: ", logDifference, habit.name, streak, prev.completed, habit.streak, prev.streak)

          console.log("Previous log's streak: ", prev)
          console.log("New current streak: ", streak)

          const query = `--sql
            UPDATE HabitHistory
            SET streak = ?
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

          const params = [streak, habit.id, habit.id, currentDate]

          try {
            await this.executeQuery(query, params)
          }
          catch (error) {
            console.log("Failed to update habit streak: ", error)
          }
        
      }*/
    }
  }
}

export class QuitHabitRepository extends BaseRepository {
  async getAllHabits() {
    const query = `--sql
      SELECT *
      FROM QuitHabits
    `

    return await this.getAllQuery(query, [])
  }

  async createHabit(data) {
    const query = `--sql
      INSERT INTO QuitHabits (name, startTime, color) VALUES (?, ?, ?)
    `
    const params = data;


    /* Params 
    name TEXT,
    startTime DATETIME NOT NULL,
    lastResetReason TEXT,
    currentDuration INTEGER DEFAULT 0,
    color TEXT
    */

    try {
      await this.executeQuery(query, params)
    } catch (error) {
      console.log("Failed to insert habit")
    }
  }

  async queryHabit(id) {
    const query = `--sql
      SELECT * 
      FROM QuitHabits
      WHERE id = ?
    `

    const params = [id]

    try {
      return await this.getAllQuery(query, params);
    }
    catch (error) {
      console.log("Failed to get QuitHabit: ", error);
    }
  }

  async resetHabit(habitId, resetTime, reason) {
    try {
      const habitData = await this.queryHabit(habitId)

      await new QuitHabitHistoryRepository().logCurrentData(habitData, resetTime, reason);

      const query = `--sql
        UPDATE QuitHabits
        SET startTime = ?, lastResetReason = ?
        WHERE id = ?
      `

      const params = [resetTime, reason, habitId]

      await this.executeQuery(query, params)

      console.log("Reset Time: ", resetTime)
      console.log("Habit: ", JSON.stringify(await this.queryHabit(habitId)))

    } catch (e) {console.log("Failed to reset quit habit: ", e)}
  }
}

export class HabitHistoryRepository extends BaseRepository {

  validProperties = [
    "completionCount",
    "completed",
    "goal",
    "streak"
  ]

  isValidProperty(property) {
    return this.validProperties.includes(property)
  }

  /**
   * Set the property of the most recent habit history (to date given)
   * @param {string} property Name of the column/property that is being changed
   * @param {string|integer|boolean} value Value that will be replacing previous history value
   * @param {string} habitId Id of the habit who's history is changed
   * @param {string} date Date in form of dateToSQL "YYYY-MM-DD"
   * 
   * @example set("completionCount", 2, 1, "2025-02-14")
   * set("completionCount", value, id, date)
   */
  async set(property, value, habitId, date) {

    if (!this.isValidProperty(property)) {
      throw new Error(`Invalid property: ${property}`);
    }

    date = await dateToSQL(date)

    const query = `--sql
      UPDATE HabitHistory
      SET ${property} = ?
      WHERE habitId = ? 
      AND date = (
        SELECT MAX(date)
        FROM HabitHistory
        WHERE habitId = ?
        AND date <= ?
      )
    `;

    const params = [value ?? 0, habitId, habitId, date];
    try {
      await this.executeQuery(query, params);
    }
    catch (error) {
      console.log(`Failed to set ${property} to ${value}: `, error)
    }
    
  } 

  async getAllHistory(habitId) {
    const query = `--sql
      SELECT *
      FROM HabitHistory
      WHERE habitId = ?
    `;

    const params = [habitId];
    try {
    return this.getAllQuery(query, params);
    }
    catch (err) {
      console.log("failed to get all history", err)
    }
  }

  /**
   * Get the property of the most recent habit history (to date given)
   * @param {string} property Name of the column/property that is being retrieved
   * @param {string} habitId Id of the habit who's history is retrieved
   * @param {string} date Date in form of dateToSQL "YYYY-MM-DD"
   * @returns The value of that column/property for given date
   */
  async getValue(property, habitId, date) {
    if (!this.isValidProperty(property)) {
      throw new Error(`Invalid property: ${property}`);
    }

    date = await dateToSQL(date)

    const query = `--sql
      SELECT ${property}
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
    `;
    const params = [habitId, habitId, date];
    const data = await this.getAllQuery(query, params);
    const res = data[0][property]; // Extracts value from object
    //console.log("getValue response: ", res);
    return res;
  }

  async getProceedingLogs(date, habitId) {
    date = await dateToSQL(date)
    
    const query = `--sql
      SELECT *
      FROM HabitHistory
      WHERE date >= ?
      AND habitId = ?
      ORDER BY date ASC
    `
    const params = [
      date,
      habitId
    ]

    console.log(date)
    try {
      const t = await this.getAllQuery(query, params)
      console.log("PROCEEDING", t)
      return t
    } catch (error) {
      console.log("Failed to retrieve habits ", error)
    }
  }

  async setCompletion (id, value, date, goal, repeat) {
    date = await dateToSQL(date)

    const completed = await this.getValue('completed', id, date)
    try {
      if (!completed && value >= goal) {
        this.set("completed", 1, id, date)
        this.set("streak", await this.getValue("streak", id, date) + 1, id, date)

        const logDate = await convertDateByRepetition(repeat, date)
        const proceedingLogs = await this.getProceedingLogs(logDate, id)
        const initialStreak = proceedingLogs[0].streak;   
        
        
        console.log("PROCEEDING LOGS: ", proceedingLogs)

        let isStreak = true;
        for (let i = 0; i < proceedingLogs.length && isStreak; i++ ) {
          const prevDate = proceedingLogs[i].date;
          const nextDate = proceedingLogs[i + 1].date;

          const prevStreak = proceedingLogs[i].streak;
          const nextStreak = proceedingLogs[i + 1].streak;

          const prevCompletion = proceedingLogs[i].completed
          const nextCompletion = proceedingLogs[i + 1].completed;

          const difference = await determineRepetition(repeat, prevDate, nextDate)

          console.log("Log diffs ", difference)
          if (difference == 1 && prevStreak > 0 && prevCompletion) {
            console.log("Pushing streak to ", nextDate)
            
            if (nextStreak == 0 ) {
              await this.set("streak", initialStreak + i, id, nextDate)
              isStreak = false;
            }
            else {
              if (nextCompletion == 0) {
                await this.set("streak", initialStreak + i, id, nextDate)
                isStreak = false;
              }
              else {
                await this.set("streak", initialStreak + i + 1, id, nextDate)
              }
              
            }
           
            
          }
          else {
            isStreak = false;
          }
          

        }
        //console.log("Proceeding Logs: ", proceedingLogs)
      }
    } catch (error) {console.log("Failed to push streak, ", error)}
    await this.set("completionCount", value, id, date)
  }

  async getCompletion (id, date) {
    date = await dateToSQL(date)
    const completionCount = await this.getValue("completionCount", id, date)

    return completionCount
  }
}

export class QuitHabitHistoryRepository extends BaseRepository {
  async logCurrentData(habitData, resetTime, reason) {

    const query = `--sql
      INSERT OR IGNORE INTO QuitHabitHistory (
        habitId,
        startTime,
        resetTime,
        previousDuration,
        reason
      )
      VALUES (?, ?, ?, ?, ?)
    `

    const params = [habitData.id, habitData.startTime, resetTime, habitData.currentDuration, reason]
      
    await this.executeQuery(query, params)
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

export class JournalEntryRepository extends BaseRepository {
  async getAllEntries () {
    query = `--sql
      SELECT *
      FROM JournalEntries
    `

    params = [];

    return await this.getAllQuery(query, params);
  }

  async createNewEntry (title, body, habitId) {
    console.log("CREATING NEW JOURNAL", title, body, habitId ?? null)

    query = `--sql
      INSERT INTO JournalEntries (title, body, habitId) VALUES (?, ?, ?)
    `

    params = [title, body, habitId ?? null]

    return await this.executeQuery(query, params);
  }

  async updateEntry (journalId, title, body, habitId) {
    query = `--sql
      UPDATE JournalEntries
      SET title = ?, body = ?, habitId = ?
      WHERE id = ?
    `

    params = [title, body, habitId, journalId]

    return await this.executeQuery(query, params)
  }
}

const convertDateByRepetition = async (repetition, currentDate) => {
  let logCreationDate;
  switch (repetition) {
    case "day":
      logCreationDate = currentDate
      break
    case "week":
      logCreationDate = await dateToSQL(await startOfWeek(currentDate))
      break
    case "month":
      logCreationDate = await dateToSQL(await startOfMonth(currentDate))
      break
    case "year":
      logCreationDate = await dateToSQL(await startOfYear(currentDate))
      break
    default:
      logCreationDate = currentDate
  }
  return logCreationDate
}

const startOfWeek = async (date) => {

  const d = new Date(date + "T00:00:00");

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

const compareDays = async (loggedDate, currentDate) => {
  const prevDate = new Date(loggedDate + "T00:00:00");
  const currDate = new Date(currentDate + "T00:00:00");

  const oneDayMs = 24 * 60 * 60 * 1000;

  console.log("Previous Date: ", prevDate);
  console.log("Current date: ", currDate)
  console.log("Difference: ", currDate - prevDate)


  
  // Checks if the difference is exactly 7 days (in milliseconds)
  if (currDate - prevDate < oneDayMs) return 0;
  if (currDate - prevDate >= oneDayMs * 2) return 2;
  else return 1
}

const compareWeeks = async (loggedDate, currentDate) => {
  const prevDate = new Date(loggedDate + "T00:00:00");
  const currDate = new Date(currentDate + "T00:00:00");

  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  //console.log("Previous Date: ", prevDate);
  //console.log("Current date: ", currDate)
  //console.log("Difference: ", currDate - prevDate)
  //console.log("One week ms: ", oneWeekMs)

  
  // Checks if the difference is exactly 7 days (in milliseconds)
  if (currDate - prevDate < oneWeekMs) return 0;
  if (currDate - prevDate >= oneWeekMs * 2) return 2;
  else return 1
}

const compareMonths = async (loggedDate, currentDate) => {
  const prevDate = new Date(loggedDate + "T00:00:00");
  const currDate = new Date(currentDate + "T00:00:00")

  const pMonthIndex = prevDate.getFullYear() * 12 + prevDate.getMonth();
  const cMonthIndex = currDate.getFullYear() * 12 + currDate.getMonth();

  //console.log("Current Month: ", cMonthIndex)
  //console.log("Difference: ", cMonthIndex - pMonthIndex)
  //console.log("Previous Month: ", pMonthIndex);

  const difference = cMonthIndex - pMonthIndex

  if (difference == 0) return 0; // same month
  if (difference == 1) return 1; // consecutive month
  else return 2; // not consecutive month
}

const compareYears = async (loggedDate, currentDate) => {
  const prevDate = new Date(loggedDate + "T00:00:00");
  const currDate = new Date(currentDate + "T00:00:00");

  const pYear = prevDate.getFullYear();
  const cYear = currDate.getFullYear();

  //console.log("Previous Year Input: ", loggedDate)
  //console.log("Current Year Input: ", currentDate)
  //console.log("Previous Year: ", pYear);
  //console.log("Current Year: ", cYear)
  //console.log("Difference: ", cYear - pYear)

  const difference = cYear - pYear

  if (difference == 0) return 0; // same year
  if (difference == 1) return 1; // consecutive year
  else return 2; // not consecutive year
}


async function determineRepetition(repeat, loggedDate, currentDate) {

  if (repeat === "day") {
    return await compareDays(loggedDate, currentDate);
  }
  else if (repeat === "week") {
    return await compareWeeks(loggedDate, currentDate);
  }
  else if (repeat === "month") {
    return await compareMonths(loggedDate, currentDate);
  }
  else if (repeat === "year") {
    return await compareYears(loggedDate, currentDate);
  }
  return 2
}

/**
 * Converts a standard JS Date() to the SQLite format YYYY-MM-DD
 * @param date the JS Date()
 * @returns JS Date() in YYYY-MM-DD format
 */
export async function dateToSQL(date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}