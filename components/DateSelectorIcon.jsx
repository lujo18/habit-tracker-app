import { View, Text, TouchableOpacity } from 'react-native'
import React, {memo, useEffect} from 'react'

const DateSelectorIcon = ({date, currentDate, setDate}) => {

  //date = new Date(new Date(date).setDate(date.getUTCDate()))

  const dayAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', weekday: 'short' })
  const dayOfMonth = new Date(date).getUTCDate()
  const monthAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', month: 'short' })
  const yearAbrev = new Date(date).toLocaleString('en-US', {timeZone: 'UTC', year: "numeric"})

  const presentDate = new Date(new Date().setDate(new Date().getUTCDate()))

  return (
    <TouchableOpacity  // was h-16
      className={`w-16 h-16 items-center justify-center bg-background-90 rounded-xl ${new Date(currentDate).toDateString() === new Date(date).toDateString() && "border-habitColors-hBlue border-2"}`}
      onPress={() => {setDate(date)}}  
    >
      {
        presentDate.getUTCMonth() != date.getUTCMonth() ? (
          presentDate.getUTCFullYear() != date.getUTCFullYear() ? (
            <Text className="text-highlight-70 text-lg font-lora-semibold-italic">{date.getUTCFullYear()}</Text>
          ) : (
            <Text className="text-highlight-70 text-lg font-lora-semibold-italic">{monthAbrev}</Text>
          )
        ) : (
          <Text className="text-highlight-70 text-lg font-lora-semibold-italic">{dayAbrev}</Text>
         
        )
      }

      
      <Text className="text-white text-3xl font-generalsans-semibold">{dayOfMonth}</Text>
    </TouchableOpacity>
  )
}

export default DateSelectorIcon