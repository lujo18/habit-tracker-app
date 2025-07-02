import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from './Text/Header'
import Subheader from './Text/Subheader'
import { StandardHabitDataContext } from '../contexts/HabitContexts'
import TextButton from './TextButton'

const sentimentLevels = Array.from({ length: 50 }, (_, i) => (i * 2) / 100)

const habitHealthStatuses = [
  { completionRate: 0, name: "Nonexistent" },
  { completionRate: 0.25, name: "Struggling" },
  { completionRate: 0.5, name: "Developing" },
  { completionRate: 0.75, name: "Consistent" },
  { completionRate: 1, name: "Mastered" }
]

const SentimentBar = ({habitData}) => {

  const [completionRate, setCompletionRate] = useState(0)
  const [meanCompletionRate, setMeanCompletionRate] = useState(0)
  const [totalCompletionRate, setTotalCompletionrate] = useState(0)
  const [meanStreak, setMeanStreak] = useState(0)

  const [habitHealthStatus, setHabitHealthStatus] = useState({})

  const standardHabitData = useContext(StandardHabitDataContext)


  useEffect(() => {
    const sumCompletion = Array.from({length: 50}, (_, i) => {
      const percent = habitData.reduce((accumulator, currentValue) => {
        const completionRatio = ((currentValue.completionCount / (currentValue?.goal || standardHabitData?.goal)) || 0)

        return accumulator + ((completionRatio >= (i * 2) / 100) ? 1 : 0 )
      }, 0);
      return parseFloat((percent / habitData.length).toFixed(2))
    })
    setCompletionRate(sumCompletion)
    const calcMeanCompletionRate = sumCompletion.reduce((total, cur) => total + cur) / sumCompletion.length
    setMeanCompletionRate(calcMeanCompletionRate)

    const calcTotalCompletionRate = sumCompletion.reduce((total, cur) => total + (cur >= .9 ? 1 : 0)) / sumCompletion.length
    setTotalCompletionrate(calcTotalCompletionRate)

    const calcMeanStreak = habitData.reduce((total, cur) => total + (cur.streak || 0), 0) / habitData.length
    setMeanStreak(calcMeanStreak)

    setHabitHealthStatus((habitHealthStatuses
      .filter(cur => calcMeanCompletionRate / 4 + calcTotalCompletionRate / 2 + calcMeanStreak / 20 >= cur.completionRate)
      .pop() || habitHealthStatuses[0]
    ))

  }, [habitData])
 
  if (!habitData || !completionRate || !standardHabitData ) {return null}

  return (
    <View className='flex gap-2'>
      <View className='flex flex-row justify-between'>
        <Header>Habit Health Index</Header>
        <Subheader>
          {habitHealthStatus.name}
        </Subheader>
      </View>
      
      {/*<Subheader>{((meanCompletionRate / 4 + totalCompletionRate / 2 + meanStreak / 50).toFixed(2))}</Subheader>*/}
    

      <View className='flex flex-row justify-evenly w-full h-8 gap-1'>
        {sentimentLevels.map((val, index) => (
          <View
            key={index}
            className='h-full min-w-0.5 flex-1 bg-highlight-60 rounded-xl'
            style={{
              backgroundColor: `rgb(${225 - (index * (225 / 50))}, ${(index * (225 / 50))}, 80)`,
              transform: [{ scale: Math.min(Math.abs((1 - val) - Math.max((completionRate[index] + ((meanCompletionRate / 4 + totalCompletionRate / 2 + meanStreak / 50) - 1)), 0)), 1)}]
            }}
          />
        ))}
      </View>

    
    </View>
  )
}

export default SentimentBar