import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'
import { useSQLiteContext } from 'expo-sqlite'


const tailwindColors = tailwindConfig.theme.extend.colors

const Home = () => {
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState([])

  const onModalClose = () => {
    setShowCreateHabit(false)
    getHabits()
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }


  const db = useSQLiteContext()

  async function getHabits() {
    try {
      const results = await db.getAllAsync('SELECT * FROM habits')
      console.log("Fetched results:", results)
      setHabits(results)

    } catch (error) {
      console.log("Error fetching habits:", error)
    }
    
  }

  const dropTable = async () => {
    try {
      await db.runAsync(`DROP TABLE IF EXISTS habits`)
    } catch (error) {
      console.log("Error dropping table", error)
    }
  }

  useEffect(() => {
    getHabits()
    
  }, [])



  const habitss = [
    {
      id: 1,
      name: "Workout",
      goal: 30,
      unit: "minutes",
      color: "hRed"
    },
    {
      id: 2,
      name: "Journal",
      goal: 2,
      unit: "pages",
      color: "hBlue"
    },
    {
      id: 3,
      name: "Meditate",
      goal: 15,
      unit: "minutes",
      color: "hGreen"
    },
    {
      id: 4,
      name: "Read",
      goal: 10,
      unit: "pages",
      color: "hPurple"
    },
    {
      id: 5,
      name: "Walk",
      goal: 15,
      unit: "minutes",
      color: "hYellow"
    }
  ]

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
        {/*<TouchableOpacity onPress={dropTable} className="w-10 h-10 bg-slate-600"><Text>DROP TABLE Habits</Text></TouchableOpacity>*/}
        <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
      </View>
      
      <FlatList
        data={[
          {
            label: "Daily",
            type: "day"
          },
          {
            label: "Weekly",
            type: "week"
          },
          {
            label: "Monthly",
            type: "month"
          },
          {
            label: "Yearly",
            type: "year"
          },
        ]}
        keyExtractor={(item) => item.type}
        renderItem={({item: group}) => (

          <FlatList
            data={habits.filter(habit => habit.repeat === group.type)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Habit data={item}/> 
            )}
            ListHeaderComponent={() => (
              <Text className="text-white">{group.label} Habits</Text>
            )}
            ListEmptyComponent={() => {
              <Text className="text-white">No Item</Text>
            }}
          />

        )}

        
      />
    </SafeAreaView>
  )
}

export default Home