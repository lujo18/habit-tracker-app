import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '../constants/icons'

const JournalEntry = ({id, title, body, linkedHabit, editEntry}) => {
  return (
    <View className="w-full border-background-80 border-2 rounded-lg py-4 px-8 justify-center mb-4 flex-row gap-4">
      <View className="flex-1">
        <Text className="text-highlight-90 text-lg font-semibold">{title}</Text>
        <Text className="text-highlight-70">{body}</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => editEntry(id, title, body, linkedHabit)}
          className="bg-background-80 p-4">
          <Text className="text-highlight-80">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default JournalEntry