import { View, Text, TouchableOpacity } from 'react-native'
import React, {memo, useEffect} from 'react'

const DateSelectorIcon = ({date, currentDate, setDate}) => {

  const dayAbrev = new Date(date).toLocaleString('en-US', { weekday: 'short' })
  const dayOfMonth = new Date(date).toLocaleString('en-US', { day: '2-digit' })
  const monthAbrev = new Date(date).toLocaleString('en-US', { month: 'short'})
  const yearAbrev = new Date(date).toLocaleString('en-US', {year: "numeric"})

  const presentDate = new Date();

  const getDate = async () => {
    return date
  }

  return (
    <TouchableOpacity 
      className={`w-16 h-16 items-center justify-center bg-background-90 rounded-xl ${new Date(`${currentDate}T00:00:00`).toDateString() === new Date(date).toDateString() && "bg-habitColors-hBlue"}`}
      onPress={() => {setDate(date)}}  
    >
      {
        presentDate.getMonth() != date.getMonth() ? (
          presentDate.getFullYear() != date.getFullYear() ? (
            <Text className="text-white">{date.getFullYear()}</Text>
          ) : (
            <Text className="text-white">{monthAbrev}</Text>
          )
        ) : (
          <Text className="text-white">{dayAbrev}</Text>
        )
      }

      
      <Text className="text-white text-2xl">{dayOfMonth}</Text>
    </TouchableOpacity>
  )
}

export default DateSelectorIcon