import { View, Text, TouchableOpacity } from 'react-native'
import React, {memo, useEffect} from 'react'
import { dateToSQL } from '../db/sqliteManager'

const DateSelectorIcon = ({date, currentDate, setDate}) => {
  const dayAbrev = new Date(date).toLocaleString('en-US', { weekday: 'short' })
  const dayOfMonth = new Date(date).toLocaleString('en-US', { day: '2-digit' })

  const getDate = async () => {
    return await dateToSQL(date)
  }

  return (
    <TouchableOpacity 
      className={`w-16 h-16 items-center justify-center bg-background-70 ${new Date(`${currentDate}T00:00:00`).toDateString() === new Date(date).toDateString() && "bg-red-800"}`}
      onPress={() => {setDate(date)}}  
    >
      <Text className="text-white">{dayAbrev}</Text>
      <Text className="text-white text-2xl">{dayOfMonth}</Text>
    </TouchableOpacity>
  )
}

export default DateSelectorIcon