import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PopupModalBase from './PopupModalBase'
import DatePicker from 'react-native-date-picker'

const TimerResetModal = ({isVisible, onClose}) => {

  const [resetTime, setResetTime] = useState(new Date());

  const handleResetTimeChange = (value) => {
    setResetTime(value)
  }

  useEffect(() => {
    setResetTime(new Date())
  }, [isVisible])

  const resetTimer = () => {

  }

  const modalContent = () => {
    return (
      <View className='h-[30vh]'>
        <Text className='text-xl text-highlight-80'>Reset Timer</Text>
        <View className='flex-1 justify-center items-center '>
          <DatePicker 
            mode='datetime'
            date={resetTime}
            onDateChange={handleResetTimeChange}
            theme='dark'
            maximumDate={new Date(new Date().setHours(23, 59, 59, 999))}
          />
        </View>
      </View>
    )
  }


  return (
    <PopupModalBase 
      isVisible={isVisible}
      handleCancel={onClose}
      handleSubmit={resetTimer}
      submitButtonText={"Reset"}
      modalContent={modalContent}
    />
  )
}

export default TimerResetModal