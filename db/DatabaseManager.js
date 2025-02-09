import * as SQLite from 'expo-sqlite'

let db = null;

export async function openDatabase(dbName) {
  try {

    db = await SQLite.openDatabaseAsync(dbName)
    console.log(`Database ${dbName} opened successfully.`)

    // Enable WAL mode. Improves performance
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Enforce foreign key contraints
    await db.execAsync('PRAGMA foreign_keys = ON;');

  } catch (error) {
    console.log("Failed to open database: ", error);
  }
}


export async function executeSql(query, params = []) {
  if (!db) {
    throw new Error('Database is not open, call openDatabaseAsync')
  }

  try {
    const result = db.execAsync(query, params)
    return result
  } catch (error) {
    console.log(`Error executing SQL: ${query}`, error)
  }
}