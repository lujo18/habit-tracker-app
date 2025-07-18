import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../Text/Header'
import Subheader from '../Text/Subheader'
import * as Haptics from 'expo-haptics'

const colorClasses = {
  red: "border-habitColors-red-up bg-transparent",
  purple: "border-habitColors-purple-up bg-transparent",
  blue: "border-habitColors-blue-up bg-transparent",
  orange: "border-habitColors-yellow-up bg-transparent"
}

const items = [
  {
    color: 'purple',
    title: 'Dynamic Habit',
    desc: 'Automatically adjusts your habit goal for you every 7 periods.',
    type: 'dynamic'
  },
  {
    color: 'blue',
    title: 'Standard Habit',
    desc: 'Set a goal and repetition rate of your choosing.',
    type: 'build'
  },
  {
    color: 'red',
    title: 'Quit Timer',
    desc: "Starts a timer that keeps track of how long you've stayed clean.",
    type: 'quit'
  },
  {
    color: 'orange',
    title: 'Tally',
    desc: "Count as much as you like without the stress of a goal.",
    type: 'tally'
  },
]

console.log("Test", `border-${items[0].color}-900`)

const HabitType = ({habitType, setHabitType}) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} className='justify-between'>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={item.title}
          className={`w-full border-2 rounded-xl p-4 mb-4 basis-[48%] ${habitType === item.type || habitType === "" ? colorClasses[item.color] : "border-background-90 bg-background" || ""}`}
          style={{
            aspectRatio: 1,
          }}
          onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setHabitType(item.type)}}
          disabled={habitType === item.type}
        >
          <Header>{item.title}</Header>
          <Subheader>{item.desc}</Subheader>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default HabitType