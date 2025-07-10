import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from './Text/Header'
import Subheader from './Text/Subheader'
import { StandardHabitDataContext } from '../contexts/HabitContexts'
import TextButton from './TextButton'
import { Link } from 'expo-router'

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

  const [showAssistant, setShowAssistant] = useState(false)

  //console.log("habit data", habitData.filter((val, index) => val != standardHabitData.referenceGoal))

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

    const calcHabitHealthStatus = (habitHealthStatuses
      .filter(cur => Math.max((calcMeanCompletionRate / 2 + calcTotalCompletionRate / 1.5 + (calcMeanStreak - 30) / 60 ), 0) >= cur.completionRate)
      .pop() || habitHealthStatuses[0]
    )

    setHabitHealthStatus(calcHabitHealthStatus)

    const lastSetDays = habitData.filter((val, index) => {
      return index > habitData.length - 8 && (val.goal === 0 || val.goal === standardHabitData.referenceGoal)
    })
    
    setShowAssistant((calcHabitHealthStatus.completionRate <= 0.25 || calcHabitHealthStatus.completionRate >= 0.75) && lastSetDays.length >= 7)

  }, [habitData])
 
  console.log("HAB", habitData)
 
  if (!habitData || !completionRate || !standardHabitData ) {return null}

  console.log("SHOW?", showAssistant)

  return (
    <View className='flex gap-2'>
      <View className='flex flex-row justify-between'>
        <Header>Habit Health Index</Header>
        <Subheader>
          {habitHealthStatus.name}
        </Subheader>
      </View>
      
      {/*<Subheader>{(Math.max((meanCompletionRate / 2 + totalCompletionRate / 1.5 + (meanStreak - 30) / 60 ), 0).toFixed(2))}</Subheader>*/}
    

      <View className='flex flex-row justify-evenly w-full h-8 gap-1'>
        {sentimentLevels.map((val, index) => (
          <View
            key={index}
            className='h-full min-w-0.5 flex-1 bg-highlight-60 rounded-xl'
            style={{
              backgroundColor: `rgb(${225 - (index * (225 / 50))}, ${(index * (225 / 50))}, 80)`,
              transform: [{ scale: Math.min(Math.abs((1 - val) - Math.max((completionRate[index] + ((meanCompletionRate / 2 + totalCompletionRate / 1.5 + (meanStreak - 30) / 60 ) - 1)), 0)), 1)}]
            }}
          />
        ))}
      </View>

      {
        (showAssistant) && (
        
        <Link 
          href={{
            pathname: 'habitEditor',
            params: { data: JSON.stringify(standardHabitData), adaptiveSuggestion: JSON.stringify({
              title:
              habitHealthStatus.completionRate <= 0.25 ? "Make habit easier" :
              habitHealthStatus.completionRate >= 0.75 && "Make habit harder",
              newGoal: 
                habitHealthStatus.completionRate <= 0.25 ? 
                  sentimentLevels.filter((val, index) => completionRate[index] >= meanCompletionRate).pop() :
                habitHealthStatus.completionRate >= 0.75 && 
                  (sentimentLevels.filter((val, index) => (completionRate[index] >= .90)).pop() * .2) + 1 ,
            })},
          }} 
          className='border-2 border-highlight-60 p-4 rounded-xl w-1/2 mx-auto'
        >
          <Text className='text-highlight-60 font-generalsans-medium'>
            {
              habitHealthStatus.completionRate <= 0.25 ? "Make habit easier" :
              habitHealthStatus.completionRate >= 0.75 && "Make habit harder"
            }
          </Text>
          
        </Link>
        )
      }

    </View>
  )
}

export default SentimentBar