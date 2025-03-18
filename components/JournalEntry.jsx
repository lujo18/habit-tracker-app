import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import icons from '../constants/icons'

const JournalEntry = ({id, date, title, body, linkedHabit, editEntry}) => {
  return (
    <View className="w-full border-background-80 border-2 rounded-lg py-4 px-8 justify-center mb-4 flex-row gap-4">
      <View className="flex-1">
        <Text className="text-highlight-90 text-lg font-semibold">{title}</Text>
        <Text className="text-highlight-60">{date}</Text>
        <Text className="text-highlight-70">{body.substring(0, body.indexOf('\n') < 0 ? 100 : body.indexOf('\n'))}{body.length > 100 || (body.indexOf('\n') >= 0 && body.indexOf('\n') <= 100) ? "..." : null}</Text>
      </View>
      <View>
        <TouchableOpacity
        onPress={() => editEntry(id, title, body, linkedHabit)}
        className="bg-background-80 p-4"
        >
          <Image
            source={icons.editEntry}
          />
          
          <Text className="text-highlight-80">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default JournalEntry