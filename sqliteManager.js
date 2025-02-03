import { useSQLiteContext } from "expo-sqlite"

export async function getHabits(db) {
  console.log("test")
  try {
    const results = await db.getAllAsync(
      `SELECT Habits.*, b.completion, b.goal, b.date
      FROM Habits
      LEFT JOIN HabitHistory AS b ON Habits.id = b.habitId`
    )

    r

    //await checkDates(results)

    console.log("Fetched results:", results)
    return results

  } catch (error) {
    console.log("Error fetching habits:", error)
  }
}

const createLog = async (db, habit) => {
  const results = await db.runAsync(
    `INSERT INTO HabitHistory (habit_key, completion, goal, date) AS (?, ?, ?, ?)`,
    [
      habit.id,
      0,
      habit.goal,
      Date.now()
    ]
  
  )
}

export async function checkDates(results) {
  try {
    
  } catch (error) {
    console.log("Error fetching habits (checkDates)", error)
  }
}