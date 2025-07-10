import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PopupModalBase from './PopupModalBase'
import DatePicker from 'react-native-date-picker'
import { QuitHabitRepository } from '../db/sqliteManager'
import { formatScrollerDate } from '../utils/formatters'

const TimerResetModal = ({data, onClose, showLoading, hideLoading}) => {
  const QuitHabitRepo = new QuitHabitRepository();

  const [resetTime, setResetTime] = useState(new Date());

  const handleResetTimeChange = (value) => {
    setResetTime(value)
  }

  useEffect(() => {
    setResetTime(new Date())
  }, [data])

  const resetTimer = async () => {
    showLoading()
    try {
      await QuitHabitRepo.resetHabit(data.id, formatScrollerDate(resetTime), "")
      onClose()
    }
    finally {
      hideLoading()
    }
  }

  const modalContent = () => {
    return (
      <View className='w-full p-4'>
        <View className='border-b-background-80 border-b-2 items-center'>
          <Text className='text-xl text-highlight'>Are you sure you want to reset?</Text>
          <Text className='text-base text-highlight-60'>{data.name}</Text>
        </View>
        <View className='justify-center items-center '>
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
      isVisible={Object.keys(data).length > 0}
      handleCancel={onClose}
      handleSubmit={resetTimer}
      submitButtonText={"Reset"}
    >
      {modalContent()}
    </PopupModalBase>
  )
}

export default TimerResetModal