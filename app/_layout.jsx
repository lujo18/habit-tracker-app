import { SplashScreen, Stack } from 'expo-router'
import * as SQLite from 'expo-sqlite'
import "../global.css"
import { useState } from 'react'
import { Text, View } from 'react-native'


SplashScreen.preventAutoHideAsync()

SplashScreen.hide()

const RootLayout = () => {
  

  const createDbIfNeeded = async(db) => {

    console.log("Created database if needed")
    try {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS habits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          setting TEXT,
          repeat TEXT,
          label TEXT,
          limitType TEXT,
          current INTEGER,
          goal INTEGER,
          color TEXT
        );`
      )

      console.log("Successfully created table")
    } catch (error) {
      console.log("Error creating table", error)
    }
  } 





  return (
    <SQLite.SQLiteProvider databaseName='habits.db' onInit={createDbIfNeeded}>
      <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </SQLite.SQLiteProvider>
  )
}

export default RootLayout

