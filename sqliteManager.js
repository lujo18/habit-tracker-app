import { useSQLiteContext } from "expo-sqlite"

export async function getHabits(db) {
  console.log("test")
  try {
    const results = await db.getAllAsync('SELECT * FROM habits')
    console.log("Fetched results:", results)
    return results

  } catch (error) {
    console.log("Error fetching habits:", error)
  }
}
