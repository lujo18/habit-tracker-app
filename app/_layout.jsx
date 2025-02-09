import { SplashScreen, Stack } from 'expo-router'
import * as SQLite from 'expo-sqlite'
import "../global.css"

import { SCHEMA_SQL } from '../db/createTables'




SplashScreen.preventAutoHideAsync()

SplashScreen.hide()

const RootLayout = () => {
  

  /*const createDbIfNeeded = async(db) => {

    console.log("Created database if needed")
    try {
      await db.execAsync(SCHEMA_SQL)

      console.log("Successfully created table")
    } catch (error) {
      console.log("Error creating table", error)
    }
  } */


  /*useEffect(() => {
    async function initializeDatabase() {
      try {

        Database

      } catch (error) {
        
      }
    }

    initializeDatabase();
  }, [])*/

  console.log("\n\nNEW RUN " + "\n\n")

  return (
    
    <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>

  )
}

export default RootLayout

