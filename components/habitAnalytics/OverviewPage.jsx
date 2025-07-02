import { View, Text } from 'react-native'
import React, { useContext, useState, useEffect, useMemo } from 'react'
import HeatMapCalendar from '../HeatMapCalendar'
import BasicContainer from '../containers/BasicContainer'
import { useDateContext } from '../../contexts/DateContext'
import CartesianAnalytics from '../CartesianAnalytics'
import Habit from '../Habit'
import { HabitDataContext, StandardHabitDataContext } from '../../contexts/HabitContexts'

const OverviewPage = () => {
  const {habitData, updateHabitData} = useContext(HabitDataContext)
  const standardHabitData = useContext(StandardHabitDataContext)
  const {selectedDate, setSelectedDate} = useDateContext()

  const [selectedAmount, setSelectedAmount] = useState(0)
  const [analyticsDate, setAnalyticsDate] = useState(null)
  
 

  useEffect(() => {
    if (selectedDate) {
      setAnalyticsDate(selectedDate)
    }
  }, [selectedDate])

  const updateSelectedAmount = (amount) => {
    setSelectedAmount(amount)
  }

  const setDate = async (value) => {
    if (updateHabitData) {
      updateHabitData()
    }

    setAnalyticsDate(new Date(value))
  };

  const habitColor = useMemo(() => {
    return standardHabitData?.color || "#0A72D4"
  }, [standardHabitData]);

  if (!habitData || !standardHabitData || !analyticsDate) {
    return <View className="flex-1 justify-center items-center"><Text>Loading...</Text></View>;
  }

  return (
    <View>
      <View className="flex flex-1 h-full w-full">
        <HeatMapCalendar 
          habitHistory={habitData} 
          selectedDay={analyticsDate} 
          setSelectedDay={setDate} 
          color={habitColor}
          selectedAmount={selectedAmount}
        />
        <Habit 
          data={standardHabitData} 
          canSubtract={true} 
          updateSelectedAmount={updateSelectedAmount} 
          providedSelectedDate={analyticsDate}
        />
      </View>
      
    </View>
  )
}

export default OverviewPage