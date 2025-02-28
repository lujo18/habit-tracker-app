import { View, Text } from 'react-native'
import React from 'react'

const JournalEntry = ({title, body, linkedHabit}) => {
  return (
    <View className="w-full border-background-80 border-2 rounded-lg py-4 px-8 justify-center mb-4">
      <Text className="text-highlight-90 text-lg font-semibold">{title}</Text>
      <Text className="text-highlight-70">{body}</Text>
    </View>
  )
}

export default JournalEntry