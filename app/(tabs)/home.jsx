import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'


const tailwindColors = tailwindConfig.theme.extend.colors

const Home = () => {
  const [showCreateHabit, setShowCreateHabit] = useState(false)

  const onModalClose = () => {
    setShowCreateHabit(false)
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }

  const habits = [
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
        <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
      </View>
      
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Habit data={item}/> 
        )}
        ListHeaderComponent={() => (
          <Text className="text-white">Your Habits</Text>
        )}
        ListEmptyComponent={() => {
          <Text className="text-white">No Item</Text>
        }}
      />
    </SafeAreaView>
  )
}

export default Home