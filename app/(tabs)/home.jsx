import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState, createContext } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'
import { dateToSQL, DevRepository, HabitsRepository } from '../../db/sqliteManager'
import DateSelector from '../../components/DateSelector' 
import { useLoading } from '../../components/LoadingProvider'
//import { Image } from 'expo-image'
import { DateContext } from '../../contexts/DateContext'



const tailwindColors = tailwindConfig.theme.extend.colors

const Home = () => {
  const habitsRepo = new HabitsRepository();
  const devRepo = new DevRepository() //DELETE THIS
  
  const yearToMs = 365 * 24 * 60 * 60 * 1000;
  const oneYearAgo = new Date(Date.now() - yearToMs);
  const oneYearAhead = new Date(Date.now());

  const { showLoading, hideLoading, isLoading } = useLoading();
  
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState([])
  const [quitHabits, setQuitHabits] = useState([])

  const [date, setDate] = useState("")

  const setCurrentDate = async (value) => {
    setDate(await dateToSQL(value))
  }

  const onModalClose = async () => {
    setShowCreateHabit(false)
    queryHabits(date)
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }

  const queryHabits = async (date) => {
    showLoading()

    setHabits(await habitsRepo.initializeHabits(date))

    setTimeout(() => {
      hideLoading()
    }, 500);
  }

  useEffect(() => {
    const initialize = async() => {
      const initDate = async () => {
        const sqlDate = await dateToSQL(new Date())
        setDate(sqlDate)  
      }

      if (!date) {
        console.log("INIT DATE")
        await initDate()
      }
      else {
        console.log("INITIALIZE")
        await queryHabits(date);
      }
    }

    initialize()
  }, [date]);



  const RepeatHeaders = useCallback(({ group }) => {
    return (
      <View className="flex-row items-center gap-2">
        <Image
          source={group.icon}
          className="w-8 h-8"
          contentFit='contain'
        />
        <Text className="text-white">{group.label} Habits</Text>
      </View>
    )
  }, [])

  

  return (
    <DateContext.Provider value={date}>
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
              contentFit='cover'
              tintColor={tailwindColors["highlight"]["90"]}
              
            />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-red-50" onPress={() => {devRepo.DropTables()}}><Text>Drop Table</Text></TouchableOpacity>
          
          <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
        </View>

        <View>
          <DateSelector start={oneYearAgo} end={oneYearAhead} currentDate={date} setDate={setCurrentDate} />
        </View>
        
        <FlatList
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
            {
              label: "Quit",
              type: "forever",
              icon: icons.habitYearly
            }
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
                      <Habit key={item.id.toString()} data={item}/> 
                    )}
                    ListHeaderComponent={() => (
                      <RepeatHeaders group={group}/>
                    )}
                  />
                )
              }
            
          }}
        />
    
      
      </SafeAreaView>
    </DateContext.Provider>
  )
}

export default Home