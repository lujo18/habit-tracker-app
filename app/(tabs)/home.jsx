import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'
import { useSQLiteContext } from 'expo-sqlite'
import { dateToSQL, getHabits } from '../../sqliteManager'


const tailwindColors = tailwindConfig.theme.extend.colors



const Home = () => {
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState([])
  const db = useSQLiteContext()

  const [date, setDate] = useState('')

  const onModalClose = async () => {
    setShowCreateHabit(false)
    setHabits(await getHabits(db, date))
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }

  const dropTable = async () => {
    try {
      await db.runAsync(`DROP TABLE IF EXISTS Habits`)
      await db.runAsync(`DROP TABLE IF EXISTS HabitHistory`)
    } catch (error) {
      console.log("Error dropping table", error)
    }
  }

  const retrieve = async() => {
    setDate(await dateToSQL(new Date()))
    setHabits(await getHabits(db, date))
  }

  useEffect(() => {
    retrieve()
  }, [])

  const RepeatHeaders = useCallback(({ group }) => {
    console.log("Headers re rendered")
    return (
      <View className="flex-row items-center gap-2">
        <Image
          source={group.icon}
          className="w-8 h-8"
          resizeMode='contain'
        />
        <Text className="text-white">{group.label} Habits</Text>
      </View>
    )
  }, [])

  return (
    <SafeAreaView className="bg-background h-full w-full px-4 flex-1">
      <View className="flex-row align-center  p-4">
        <View>
          <Text>Other Option</Text>
        </View>
        <View className="flex-1">
          <Text>Today's Progress</Text>
        </View>
        <TouchableOpacity className={`bg-background-80 p-4 rounded-full ${showCreateHabit ? "opacity-0" : ""}`} onPress={() => onAddHabit()}>
          <Image 
            source={icons.addBox}
            className="w-9 h-9"
            resizeMode='cover'
            tintColor={tailwindColors["highlight"]["90"]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={dropTable} className="w-10 h-10 bg-slate-600"><Text>DROP TABLE Habits</Text></TouchableOpacity>
        <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
      </View>
      
      {/*<FlatList
        data={[
          {
            label: "Daily",
            type: "day",
            icon: icons.habitDaily
          },
          {
            label: "Weekly",
            type: "week",
            icon: icons.habitWeekly
          },
          {
            label: "Monthly",
            type: "month",
            icon: icons.habitMonthly
          },
          {
            label: "Yearly",
            type: "year",
            icon: icons.habitYearly
          },
        ]}
        keyExtractor={(item) => item.type}
        renderItem={({item: group}) => {
            const filteredHabits = habits.filter(habit => {return habit.repeat === group.type; })
          
            if (filteredHabits.length > 0) {
              return (
                <FlatList
                  data={filteredHabits}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Habit data={item}/> 
                  )}
                  ListHeaderComponent={() => (
                    <RepeatHeaders group={group} />
                  )}
                />
              )
            }
          
        }}

        
      />*/}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Habit data={item}/> 
        )}
        
      />
    </SafeAreaView>
  )
}



export default Home
