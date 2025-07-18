import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from './Text/Header'
import Subheader from './Text/Subheader'
import { StandardHabitDataContext } from '../contexts/HabitContexts'
import TextButton from './TextButton'
import { Link } from 'expo-router'
import { calculateEMA } from '../utils/formulas'

const sentimentLevels = Array.from({ length: 50 }, (_, i) => (i / 50))

const habitHealthStatuses = [
  { completionRate: 0, name: "Nonexistent" },
  { completionRate: 0.25, name: "Struggling" },
  { completionRate: 0.5, name: "Developing" },
  { completionRate: 0.75, name: "Consistent" },
  { completionRate: 1, name: "Mastered" }
]

const SentimentBar = ({habitData}) => {

  const [completionRates, setCompletionRates] = useState([])
  const [meanCompletionRate, setMeanCompletionRate] = useState(0)
  const [highDayRate, setHighDayrate] = useState(0)
  const [meanStreak, setMeanStreak] = useState(0)

  const [emaCompletionRate, setEmaCompletionRate] = useState(0)
  const [emaStreak, setEmaStreak] = useState(0)

  const [habitHealthStatus, setHabitHealthStatus] = useState({})

  const standardHabitData = useContext(StandardHabitDataContext)

  const [showAssistant, setShowAssistant] = useState(false)
  
  const [newGoal, setNewGoal] = useState(0)

  //console.log("habit data", habitData.filter((val, index) => val != standardHabitData.referenceGoal))

  useEffect(() => {
    const lastAdjustment = standardHabitData.lastAdjustmentDate
    const daysSinceLastAdjustment = Math.floor(
      (new Date() - new Date(/*"2025-7-6"*/lastAdjustment)) / (1000 * 60 * 60 * 24) // FIX AFTER TESTING
    )
      
    if (daysSinceLastAdjustment < 7 && habitData.length === 0) return

    const lastSevenEntries = habitData.slice(-7)

    const completionRates = Array.from({length: 50}, (_, i) => {
      const percent = habitData.reduce((accumulator, currentValue) => {
        const completionRatio = ((currentValue.completionCount / (currentValue?.goal || standardHabitData?.goal)) || 0)

        return accumulator + ((completionRatio >= (i * 2) / 100) ? 1 : 0 )
      }, 0);
      return parseFloat((percent / habitData.length).toFixed(2))
    })
    setCompletionRates(completionRates)

    const calcMeanCompletionRate = completionRates.reduce((total, cur) => total + cur) / completionRates.length
    setMeanCompletionRate(calcMeanCompletionRate)
    const emaCompletionRate = calculateEMA(completionRates, 0.2)
    setEmaCompletionRate(emaCompletionRate)

    const highDayRate = completionRates.reduce((total, cur) => total + (cur >= .9 ? 1 : 0)) / completionRates.length
    setHighDayrate(highDayRate)

    const calcMeanStreak = habitData.reduce((total, cur) => total + (cur.streak || 0), 0) / habitData.length
    setMeanStreak(calcMeanStreak)

    const streaks = lastSevenEntries.map(entry => entry.streak || 0)

    const emaStreak = calculateEMA(streaks, 0.2)
    const normStreak = Math.min(emaStreak / 30, 1)
    setEmaStreak(normStreak)

    const score = Math.max((
      (emaCompletionRate * 0.5) +
      (highDayRate * 0.3) +
      (normStreak * 0.2)
    ), 0)


    const filteredStatuses = habitHealthStatuses.filter(cur => score >= cur.completionRate)
   
    const healthStatus = (habitHealthStatuses
      .filter(s => score >= s.completionRate)
      .pop() || habitHealthStatuses[0]
    )

    setHabitHealthStatus(healthStatus)
    
    const newGoal =
      healthStatus.completionRate <= 0.25 ? 
        sentimentLevels.filter((val, index) => completionRates[index] >= calcMeanCompletionRate).pop() :
      healthStatus.completionRate >= 0.75 && 
        Math.ceil((sentimentLevels.filter((val, index) => (completionRates[index] >= .90)).pop() * .1) + 1)

    if (typeof newGoal == "number") {
      const rawGoal = Math.max(standardHabitData.referenceGoal * newGoal, 1)

      const clampedGoal = Math.round(rawGoal)
      const maxUp = standardHabitData.referenceGoal * 1.15
      const maxDown = standardHabitData.referenceGoal * .85

      const calculatedGoal = Math.ceil(Math.min(Math.floor(Math.max(maxDown, rawGoal)), maxUp))
      console.log("CALC GOAL:", calculatedGoal)
      setNewGoal(calculatedGoal)

      setShowAssistant((healthStatus.completionRate <= 0.25 || healthStatus.completionRate >= 0.75) && daysSinceLastAdjustment >= 7)
    }


  }, [habitData, standardHabitData])
 
 
  if (!habitData || !completionRates || !standardHabitData || !habitHealthStatus || !newGoal ) {return null}

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
              transform: [{ scale: Math.min(Math.abs((1 - val) - Math.max((completionRates[index] + ((meanCompletionRate / 2 + highDayRate / 1.5 + (meanStreak - 30) / 60 ) - 1)), 0)), 1)}]
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
              newGoal: newGoal
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