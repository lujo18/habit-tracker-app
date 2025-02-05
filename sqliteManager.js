import { useSQLiteContext } from "expo-sqlite"


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

export async function createLogs(results, db) {
  for (let habit of results) {
    if (habit.date == null || await determineRepetition(habit.repeat, habit.date)) {
      console.log("No history", habit)
      await db.runAsync(
        `INSERT INTO HabitHistory (habitId, completion, goal, date) VALUES (?, ?, ?, ?)`,
        [
          habit.id,
          0,
          habit.referenceGoal,
          await dateToSQL(new Date())
        ]
      )
    }
  }
}

async function queryHabits(db, date) {
  const habits = await db.getAllAsync(
    `SELECT Habits.*, b.completion, b.goal, b.date
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
    )`, [Date(date)]
  )

  return habits
}

export async function getHabits(db, date) {
  try {
    const results = await queryHabits(db, date)

    await createLogs(results, db)

    const history = await db.getAllAsync(
      `SELECT * FROM HabitHistory`
    )

    console.log("HISTORY", history)

    const updatedResults = await queryHabits(db, date)
    

    //await checkDates(results)

    console.log("Fetched results:", updatedResults)
    return updatedResults

  } catch (error) {
    console.log("Error fetching habits:", error)
  }
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