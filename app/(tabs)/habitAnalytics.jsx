import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect, useContext, createContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CartesianAnalytics from "../../components/CartesianAnalytics";
import { HabitHistoryRepository } from "../../db/sqliteManager";
import tailwindConfig from "../../tailwind.config";
import Calendar from "../../components/Calendar";
import Habit from "../../components/Habit";
import { DateContext, useDateContext } from "../../contexts/DateContext";
import HeatMapCalendar from "../../components/HeatMapCalendar";
import ScrollingPager from "../../components/Paging/ScrollingPager";
import OverviewPage from "../../components/habitAnalytics/OverviewPage";
import { HabitDataContext, StandardHabitDataContext } from "../../contexts/HabitContexts";
import Charts from "../../components/habitAnalytics/Charts";

const habitAnalytics = () => {

  // const params = useLocalSearchParams()
  // const data = JSON.parse(params.data)
  
  //const date = new Date(params.selectedDate);
  //date.setDate(date.getDate() - 1);
  const params = useLocalSearchParams() // Gets basic data about habit
  const standardHabitData = JSON.parse(params.data)
  
  const router = useRouter();

  const habitHistoryRepo = new HabitHistoryRepository();

  //const [analyticDate, setAnalyticDate] = useState(selectedDate);

  const [habitData, setHabitData] = useState([]); // HabitData for context

  // const [selectedAmount, setSelectedAmount] = useState(0)

  // useEffect(() => {
  //   setAnalyticDate(selectedDate)
  // }, [selectedDate])

  const updateHabitData = async () => {
    const historyData = await habitHistoryRepo.getAllHistory(parseInt(standardHabitData.id))
    setHabitData(historyData);
  };

  useEffect(() => {
    updateHabitData();
  }, [standardHabitData.id]);

  // const setDate = async (value) => {
  //   getData()
  //   //setAnalyticDate(new Date(value));
  //   setSelectedDate(new Date(value))
  //   setAnalyticDate(new Date(value))
  // };

  // const updateSelectedAmount = (amount) => {
  //   setSelectedAmount(amount)
  // }


  return (
    <HabitDataContext.Provider value={{habitData, updateHabitData}}>
      <StandardHabitDataContext.Provider value={standardHabitData}>
        <SafeAreaView className="w-full h-full bg-background-90" edges={["top"]}>
          <View className="p-4 flex-row">
            <TouchableOpacity className="flex-1" onPress={() => router.back()}>
              <Text className="text-white">BACK</Text>
            </TouchableOpacity>
            <Text className="flex-2 text-2xl text-white">{standardHabitData.name}</Text>
            <View className="flex-1"></View>
          </View>
          <View className="flex-1">
            <ScrollingPager>
              <OverviewPage pageTitle="Overview" showsVerticalScrollIndicator={false} />
              <Charts pageTitle="Charts" showsVerticalScrollIndicator={false} />
        
        
        
            </ScrollingPager>
          </View>
        </SafeAreaView>
      </StandardHabitDataContext.Provider>
    </HabitDataContext.Provider>
  );
};


export default habitAnalytics;
