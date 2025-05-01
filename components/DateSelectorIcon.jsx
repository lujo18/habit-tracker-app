import { View, Text, TouchableOpacity } from 'react-native'
import React, {memo, useEffect} from 'react'

const DateSelectorIcon = ({date, currentDate, setDate}) => {

  //date = new Date(new Date(date).setDate(date.getUTCDate()))

  const dayAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', weekday: 'short' })
  const dayOfMonth = new Date(date).getUTCDate()
  const monthAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', month: 'short' })
  const yearAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', year: "numeric"})

  const presentDate = new Date(new Date().setDate(new Date().getUTCDate()))

  const getDate = async () => {
    return date
  }

  return (
    <TouchableOpacity  // was h-16
      className={`w-40 h-40 items-center justify-center bg-background-90 rounded-xl ${new Date(currentDate).toDateString() === new Date(date).toDateString() && "bg-habitColors-hBlue"}`}
      onPress={() => {setDate(date)}}  
    >
      {
        presentDate.getUTCMonth() != date.getUTCMonth() ? (
          presentDate.getUTCFullYear() != date.getUTCFullYear() ? (
            <Text className="text-white">{date.getUTCFullYear()}</Text>
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