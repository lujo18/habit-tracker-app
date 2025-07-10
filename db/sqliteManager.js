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
      //return null
    }
    
  }
  
}

export class DevRepository extends BaseRepository {
  async DropTables() {
    try {
      const db = await this.db;

      // Disable foreign key constraints temporarily
      await db.runAsync(`PRAGMA foreign_keys = OFF;`);

      // Delete rows in child tables first
      await db.runAsync(`DELETE FROM HabitHistory`);
      await db.runAsync(`DELETE FROM QuitHabitHistory`);
      await db.runAsync(`DELETE FROM Habits`);
      await db.runAsync(`DELETE FROM QuitHabits`);
      await db.runAsync(`DELETE FROM HabitLabel`);
      await db.runAsync(`DELETE FROM HabitLocation`);
      await db.runAsync(`DELETE FROM JournalEntries`);
      await db.runAsync(`DELETE FROM sqlite_sequence;`); // Reset AUTOINCREMENT counters

      // Drop tables in the correct order
      await db.runAsync(`DROP TABLE IF EXISTS HabitHistory`);
      await db.runAsync(`DROP TABLE IF EXISTS QuitHabitHistory`);
      await db.runAsync(`DROP TABLE IF EXISTS Habits`);
      await db.runAsync(`DROP TABLE IF EXISTS QuitHabits`);
      await db.runAsync(`DROP TABLE IF EXISTS HabitLabel`);
      await db.runAsync(`DROP TABLE IF EXISTS HabitLocation`);
      await db.runAsync(`DROP TABLE IF EXISTS JournalEntries`);

      // Re-enable foreign key constraints
      await db.runAsync(`PRAGMA foreign_keys = ON;`);

      console.log("Successfully dropped tables");
    } catch (error) {
      console.log("Failed to drop tables", error);
    }
  }

  async TestQuery() {
    const query = `SELECT * FROM HabitHistory`

    const result = await this.getAllQuery(query)
    
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
      
      //console.log("Habits\n" + JSON.stringify(updatedResults))

      return updatedResults
    } catch (error) {
      console.log("Error fetching habits:", error)
    }
  }

  async get(id) {
    const query = `--sql
      SELECT *
      FROM Habits
      WHERE id = ?
      LIMIT 1
    `;

    const params = [id]

    const result = await this.getAllQuery(query, id);
    return result[0] ?? null;
  }

  async getAll() {
    const query = `--sql
      SELECT *
      FROM Habits
    `

    return await this.getAllQuery(query, [])
  }

  async setValues(id, properties, values) {
    properties = properties.map((val) => `${val} = ?`)

    console.log("PRPS", ...properties, id)

    const query = `--sql
      UPDATE Habits
      SET ${properties.join(', ')}
      WHERE id = ?
    `

    const params = [...values, id]

    try {
      await this.executeQuery(query, params);
    }
    catch (error) {
      console.log(`Failed to set ${properties} to ${values}: `, error)
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


  async setPeriod(property, value, habitId, periodKey) {

    if (!this.isValidProperty(property)) {
      throw new Error(`Invalid property: ${property}`);
    }

    periodKey = await dateToSQL(periodKey)

    const query = `--sql
      UPDATE HabitHistory
      SET ${property} = ?
      WHERE habitId = ? 
      AND periodKey = ?
    `;

    const params = [value ?? 0, habitId, periodKey];

    console.warn("Set period", query, params)
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

  /**
   * Get the property of the most recent habit history for a given periodKey.
   * @param {string} property Name of the column/property that is being retrieved
   * @param {string} habitId Id of the habit whose history is retrieved
   * @param {string} date Period key in form of dateToSQL "YYYY-MM-DD"
   * @returns The value of that column/property for the given periodKey
   */
  async getValueForPeriod(property, habitId, date) {
    if (!this.isValidProperty(property)) {
      throw new Error(`Invalid property: ${property}`);
    }

    const habit = await new HabitsRepository().get(habitId);
    const periodKeyDate = await getPeriodKey(habit.repeat, date);

    const query = `--sql
      SELECT ${property}
      FROM HabitHistory
      WHERE habitId = ?
      AND periodKey = ?
      ORDER BY date DESC
      LIMIT 1
    `;
    const params = [habitId, periodKeyDate];
    const data = await this.getAllQuery(query, params);
    const res = data && data[0] ? data[0][property] : undefined;
    return res;
  }

  async getEntry(id, date) {
    date = await dateToSQL(date)

    const query = `--sql
      SELECT h.*, (
        SELECT SUM(completionCount)
        FROM HabitHistory h2
        WHERE h2.periodKey = h.periodKey
        AND h2.habitId = h.habitId
      ) AS periodCompletion,
      (
        SELECT streak
        FROM HabitHistory h2
        WHERE h2.periodKey = h.periodKey
        AND h2.habitId = h.habitId
      ) AS periodStreak
      FROM HabitHistory h
      WHERE h.date = ?
      AND h.habitId = ?
      LIMIT 1
    `
    const params = [
      date,
      id
    ]

    try {
      const result = await this.getAllQuery(query, params);
      //console.log("Get entry results: ", result[0])
      return result[0] ?? null;
    }
    catch (e) {
      console.log("Failed to get entry", e);
    }
     
  }

  async getPeriodData(id, date) {
    date = await dateToSQL(date)
    const habit = await new HabitsRepository().get(id);
    const periodKeyDate = await getPeriodKey(habit.repeat, date);

    const query = `--sql
      SELECT *, SUM(completionCount) AS periodCompletion
      FROM HabitHistory h2
      WHERE periodKey = ?
      AND habitId = ?
      LIMIT 1
    `
    const params = [
      periodKeyDate,
      id
    ]

    try {
      const result = await this.getAllQuery(query, params);
      //console.log("Get entry results: ", result[0])
      return result[0]?.id ? result[0] : null;
    }
    catch (e) {
      console.log("Failed to get entry", e);
    }
  }

  async getEntryWithCheck(id, date) {
    try {
      date = await dateToSQL(date)

      const result = await this.getEntry(id, date)

      if (result == null) {
        await this.createEntry(id, date)
        const entry = await this.getEntry(id, date)
        console.log("Got entry:", entry);
        return entry 
      } else {
        return result
      }
    } catch (error) {
      console.log("Failed to get or create entry", error)
    }
  }

  async createEntry(id, date) { 
    const habit = await new HabitsRepository().get(id);

    const periodKeyDate = await getPeriodKey(habit.repeat, date);

    const query = `--sql
      INSERT OR IGNORE INTO HabitHistory (habitId, completionCount, goal, date, streak, periodKey)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      habit.id,
      1,
      habit.referenceGoal,
      date,
      0,
      periodKeyDate
    ]

    
    try {
      await this.executeQuery(query, params)
      console.log(await this.getEntry(id, date))
      console.log("Successfully created new entry");
    } catch (error) {
      console.log("Failed to create entry", error)
    }
  }

  async getProceedingLogs(date, habitId) {
    date = await dateToSQL(date)

    console.log("Get proceeding dates for:", date)
    
    const query = `--sql
      SELECT *
      FROM (
        SELECT *,
                ROW_NUMBER() OVER (PARTITION BY periodKey ORDER BY date ASC) AS rn
        FROM HabitHistory
        WHERE periodKey >= ?
        AND habitId = ?
      ) t
      WHERE rn = 1;
    `
    const params = [
      date,
      habitId
    ]

    console.log(date)
    try {
      const t = await this.getAllQuery(query, params)
      //console.log("PROCEEDING", t)
      return t
    } catch (error) {
      console.log("Failed to retrieve habits ", error)
    }
  }

  /**
   * Gets the habit history entries for days after the given date, stopping at the first missed day (where streak breaks).
   * @param {number} id - The habit ID.
   * @param {string} date - The starting date (YYYY-MM-DD).
   * @returns {Promise<Array>} Array of HabitHistory entries up to the first missed day.
   */
  async getStreakUntilMissed(id, date) {
    date = await dateToSQL(date);
   
    const habit = await new HabitsRepository().get(id);
    const repeat = habit?.repeat;
    const logs = await this.getProceedingLogs(date, id);
    const streakLogs = [];

    //streakLogs.push(logs[0])
    for (let i = 1; i < logs.length; i++) {
      // Check if the next log's periodKey is the next period after the current one
      const currentKey = logs[i - 1].periodKey;
      const nextKey = logs[i].periodKey;
      let isConsecutive = false;

      console.log("Comparing dates: ", currentKey, nextKey, (new Date(nextKey) - new Date(currentKey)), 24 * 60 * 60 * 1000)

      if (logs[i - 1] && logs[i]) {
        switch (repeat) {
          case "day":
        isConsecutive = (new Date(nextKey) - new Date(currentKey)) === 24 * 60 * 60 * 1000;
        break;
          case "week":
        isConsecutive = (new Date(nextKey) - new Date(currentKey)) === 7 * 24 * 60 * 60 * 1000;
        break;
          case "month":
        const curDate = new Date(currentKey);
        const nextDate = new Date(nextKey);
        isConsecutive =
          nextDate.getUTCFullYear() === curDate.getUTCFullYear() &&
          nextDate.getUTCMonth() === curDate.getUTCMonth() + 1 ||
          (curDate.getUTCMonth() === 11 && nextDate.getUTCMonth() === 0 && nextDate.getUTCFullYear() === curDate.getUTCFullYear() + 1);
        break;
          case "year":
        isConsecutive = (new Date(nextKey).getUTCFullYear() - new Date(currentKey).getUTCFullYear()) === 1;
        break;
          default:
        isConsecutive = false;
        }
      }
      if (!isConsecutive) break;
      streakLogs.push(logs[i]);
      
    }

    return streakLogs;
  }

  /**
   * Gets the streak value of the period directly before the current one.
   * If there is no entry for the immediately preceding period, returns 0.
   * @param {number} id - The habit ID.
   * @param {string|Date} date - The current date (YYYY-MM-DD or Date).
   * @returns {Promise<number>} The streak value of the previous period or 0.
   */
  async getStrictPreviousPeriodStreak(id, date) {
    const habit = await new HabitsRepository().get(id);
    if (!habit) return 0;
    const repeat = habit.repeat;
    let currentPeriodKey = await getPeriodKey(repeat, date);

    // Calculate the previous period key based on repeat type
    let prevPeriodDate = new Date(currentPeriodKey);
    switch (repeat) {
      case "day":
        prevPeriodDate.setDate(prevPeriodDate.getDate() - 1);
        break;
      case "week":
        prevPeriodDate.setDate(prevPeriodDate.getDate() - 7);
        break;
      case "month":
        prevPeriodDate.setMonth(prevPeriodDate.getMonth() - 1);
        break;
      case "year":
        prevPeriodDate.setFullYear(prevPeriodDate.getFullYear() - 1);
        break;
      default:
        return 0;
    }
    const prevPeriodKey = await dateToSQL(prevPeriodDate);

    const query = `--sql
      SELECT streak, completed
      FROM HabitHistory
      WHERE habitId = ?
      AND periodKey = ?
      ORDER BY date DESC
      LIMIT 1
    `;
    const params = [id, prevPeriodKey];
    const data = await this.getAllQuery(query, params);
    //console.log("data", data)
    return data && (data.length > 0 && data[0].completed == 1) ? data[0].streak : 0;
  }

  async getPreviousPeriodStreak(id, date) {

    const habit = await new HabitsRepository().get(id);

    const periodKey = await getPeriodKey(habit.repeat, date)

    const query = `--sql
      SELECT streak
      FROM HabitHistory
      WHERE habitId = ?
      AND periodKey < ?
      ORDER BY periodKey DESC
      LIMIT 1
    `

    const params = [id, periodKey]

    const data = await this.getAllQuery(query, params)
    return data.length > 0 ? data[0].streak : 0;
  }

  async setCompletion (id, value, date, goal, periodKey, currentStreak) {
    date = await dateToSQL(date)
      try {
      
      if (!periodKey) {
        const habit = await new HabitsRepository().get(id);
        periodKey = await getPeriodKey(habit?.repeat, date)
      }

      await this.set("completionCount", value, id, date)
      
      const periodData = await this.getPeriodData(id, date)
      const periodAmount = periodData.periodCompletion

      //const previousPeriodStreak = await this.getPreviousPeriodStreak(id, date)

      //console.log("Period data:", previousPeriodStreak)
    
      const completed = await this.getValueForPeriod("completed", id, date)
      //let currentStreak = await this.getValueForPeriod("streak", id, date)

      //if (currentStreak == 0 && currentStreak != previousPeriodStreak) {currentStreak = previousPeriodStreak}
      
      //console.log("Current Streak:", currentStreak)
      
      //console.log("Data", periodAmount, goal)
      if (!completed && periodAmount >= goal) {
        const newStreak = currentStreak + 1

        await this.setPeriod("completed", 1, id, periodKey)
        await this.setPeriod("streak", newStreak, id, periodKey)

        const datesAfter = await this.getStreakUntilMissed(id, periodKey)
        //console.error("DATES AFTER", datesAfter)

        let i = 1;
        for (const log of datesAfter) {
          //console.log("Updating Streak: ", log, newStreak + i)
          //if (datesAfter[i - 1]?.streak == log.streak) .{
          await this.setPeriod("streak", log.completed == 1 ? newStreak + i : newStreak + i - 1, id, log.periodKey) 
          //}
          if (log.completed == 0) {
            break
          }
          i++
        }

        /*const logDate = await convertDateByRepetition(repeat, date)
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
          

        }*/
        //console.log("Proceeding Logs: ", proceedingLogs)
      }
      else if (completed && periodAmount < goal) {
        const newStreak = currentStreak - 1

        await this.setPeriod("completed", 0, id, periodKey)
        await this.setPeriod("streak", newStreak, id, periodKey)
      }
      
    } catch (error) {console.error("Failed to push streak, ", error)}
    
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

// Gets the keyDate for history (so the first day of it's time period)
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
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

async function getPeriodKey(repeat, date = Date.now()) {
  let periodKeyDate = new Date(date);
  switch (repeat) {
    case "day":
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "week":
      periodKeyDate.setDate(periodKeyDate.getDate() - periodKeyDate.getDay())
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "month":
      periodKeyDate.setDate(1);
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "year":
      periodKeyDate.setMonth(0, 1);
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    default:
      console.error("Invalid repeat type")
      return null;
  }
}