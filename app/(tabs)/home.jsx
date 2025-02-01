import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'
import { useSQLiteContext } from 'expo-sqlite'
import { getHabits } from '../../sqliteManager'


const tailwindColors = tailwindConfig.theme.extend.colors



const Home = () => {
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState([])
  const db = useSQLiteContext()

  const onModalClose = async () => {
    setShowCreateHabit(false)
    setHabits(await getHabits(db))
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }

  const dropTable = async () => {
    try {
      await db.runAsync(`DROP TABLE IF EXISTS habits`)
    } catch (error) {
      console.log("Error dropping table", error)
    }
  }

  const retrieve = async() => {
    setHabits(await getHabits(db))
  }

  useEffect(() => {
    retrieve()
    
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
                    <Text className="text-white">{group.label} Habits</Text>
                  )}
                />
              )
            }
          
        }}

        
      />
    </SafeAreaView>
  )
}

export default Home