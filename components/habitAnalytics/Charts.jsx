import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HabitDataContext, StandardHabitDataContext } from '../../contexts/HabitContexts'
import CartesianAnalytics from '../CartesianAnalytics';
import { formatChartData, getPeriodData } from '../../utils/dateRetriver';
import BasicContainer from '../containers/BasicContainer';
import Header from '../Text/Header';
import Subheader from '../Text/Subheader';
import XLHeader from '../Text/XLHeader';
import SentimentBar from '../SentimentBar';

const Charts = () => {
  const {habitData} = useContext(HabitDataContext);
  const standardHabitData = useContext(StandardHabitDataContext);

  const [filledHabitData, setFilledHabitData] = useState([])
  const [periodHabitData, setPeriodHabitData] = useState([])

  const [completionRate, setCompletionRate] = useState(0)
  const [prevTimeperiodCompletionRate, setPrevTimeperiodCompletionRate] = useState(0)
  const [curTimeperiodCompletionRate, setCurTimeperiodCompletionRate] = useState(0)
  const [Q1CompletionRate, setQ1CompletionRate] = useState(0)
  const [Q2CompletionRate, setQ2CompletionRate] = useState(0)
  const [Q3CompletionRate, setQ3CompletionRate] = useState(0)
  const [averageShowup, setAverageShowup] = useState(0)

  const timeFrame =
    Math.floor((new Date() - new Date(habitData[0]?.date)) / (1000 * 60 * 60 * 24)) +
    1; // Days since start

  useEffect(() => {
    const temp = async () => {

      try {

        
        const filledData = await formatChartData(habitData, timeFrame, standardHabitData.repeat);
        // Group by periodKey and sum completionCount, keeping periodKey as date and goal for the period
        const periodDataArray = getPeriodData(filledData)

        console.log("PERIOD", periodDataArray)
        setFilledHabitData(filledData);
        setPeriodHabitData(periodDataArray)

        const sumCompletion = periodDataArray.reduce((accumulator, currentValue) => accumulator + (((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= 1 ? 1 : 0 ), 0);
        setCompletionRate(Math.round(sumCompletion / periodDataArray.length * 100))

        const sumQ1Completion = periodDataArray.reduce((accumulator, currentValue) => accumulator + (((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= .25 ? 1 : 0 ), 0);
        setQ1CompletionRate(Math.round(sumQ1Completion / periodDataArray.length * 100))

        const sumQ2Completion = periodDataArray.reduce((accumulator, currentValue) => accumulator + (((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= .5 ? 1 : 0 ), 0);
        setQ2CompletionRate(Math.round(sumQ2Completion / periodDataArray.length * 100))
        
        const sumQ3Completion = periodDataArray.reduce((accumulator, currentValue) => accumulator + (((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= .75 ? 1 : 0 ), 0);
        setQ3CompletionRate(Math.round(sumQ3Completion / periodDataArray.length * 100))

        const sumActivity = periodDataArray.reduce((accumulator, currentValue) => accumulator + (currentValue.completionCount > 0 ? 1 : 0), 0)
        setAverageShowup(Math.round(sumActivity / periodDataArray.length * 100))



        const prevTimeperiodSumCompletion = periodDataArray.reduce((accumulator, currentValue) => {
          const currentDate = new Date(currentValue.date);
          const now = new Date();
          const daysAgo = (now - currentDate) / (1000 * 60 * 60 * 24);
          if (daysAgo > 30 && daysAgo <= 60) {
            return accumulator + ((((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= 1) ? 1 : 0);
          }
          return accumulator;
        }, 0);
        setPrevTimeperiodCompletionRate(Math.round(prevTimeperiodSumCompletion / 30 * 100))

        const curTimeperiodSumCompletion = periodDataArray.reduce((accumulator, currentValue) => {
          const currentDate = new Date(currentValue.date);
          const now = new Date();
          const daysAgo = (now - currentDate) / (1000 * 60 * 60 * 24);
          if (daysAgo <= 30) {
            return accumulator + ((((currentValue.completionCount / (currentValue.goal || standardHabitData.goal)) || 0) >= 1) ? 1 : 0);
          }
          return accumulator;
        }, 0);
        setCurTimeperiodCompletionRate(Math.round(curTimeperiodSumCompletion / 30 * 100))

      } catch (error) {
        console.error("Error in temp function:", error);
      }
    }

    try {
      temp()
    } catch (error) {
      console.error("Error in Charts useEffect:", error);
    }
  }, [habitData])




  

  return (
    <View className='flex gap-4'>
      <View className='flex flex-row gap-4'>
        <BasicContainer>
          <Subheader>Showup rate:</Subheader>
          <XLHeader>{averageShowup}%</XLHeader>
          <Text className='text-background-70 font-generalsans-medium text-sm'>How often you complete at least one action</Text>
        </BasicContainer>
        <BasicContainer>
          <Subheader>Completion rate:</Subheader>
          <XLHeader>{completionRate}%</XLHeader>
          <Text className='text-background-70 font-generalsans-medium text-sm'>How often you complete your goal</Text>
        </BasicContainer>
      </View>
    
        <BasicContainer>
          
          <SentimentBar habitData={periodHabitData}/>
          <View className='flex flex-row justify-evenly pt-2'>
            <View>
              <XLHeader>{Q1CompletionRate}%</XLHeader>
              <Text className='text-background-70 font-generalsans-medium text-sm'>25% of goal</Text>
            </View>
            <View>
              <XLHeader>{Q2CompletionRate}%</XLHeader>
              <Text className='text-background-70 font-generalsans-medium text-sm'>50% of goal</Text>
            </View>
            <View>
              <XLHeader>{Q3CompletionRate}%</XLHeader>
              <Text className='text-background-70 font-generalsans-medium text-sm'>75% of goal</Text>
            </View>
          </View>
        </BasicContainer>
      
      


      <CartesianAnalytics
        data={habitData}
        xKey={"date"}
        yKeys={["completionCount"]}
      />


    </View>
  )
}

export default Charts