import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CartesianAnalytics from "../../../components/CartesianAnalytics";
import { HabitHistoryRepository, HabitsRepository } from "../../../db/sqliteManager";
import Habit from "../../../components/Habit";
import { useDateContext } from "../../../contexts/DateContext";
import HeatMapCalendar from "../../../components/HeatMapCalendar";
import ScrollingPager from "../../../components/Paging/ScrollingPager";
import OverviewPage from "../../../components/habitAnalytics/OverviewPage";
import { HabitDataContext, StandardHabitDataContext } from "../../../contexts/HabitContexts";
import Charts from "../../../components/habitAnalytics/Charts";
import { useHabitUpdate } from "../../../contexts/HabitUpdateContext";


const habitAnalytics = () => {
  const habitRepo = useMemo(() => new HabitsRepository(), [])
  // const params = useLocalSearchParams()
  // const data = JSON.parse(params.data)
  
  //const date = new Date(params.selectedDate);
  //date.setDate(date.getDate() - 1);
  const params = useLocalSearchParams() // Gets basic data about habit
  const [standardHabitData, setStandardHabitData] = useState(JSON.parse(params.data))

  const router = useRouter();

  const habitHistoryRepo = new HabitHistoryRepository();

  //const [analyticDate, setAnalyticDate] = useState(selectedDate);

  const [habitData, setHabitData] = useState([]); // HabitData for context

  const {lastUpdateTimestamp} = useHabitUpdate()

  const updateHabitData = async () => {
    try {
      const historyData = await habitHistoryRepo.getAllHistory(parseInt(standardHabitData.id));
      setHabitData(historyData);
      const habitData = await habitRepo.get(standardHabitData.id);
      console.log("Habit data", habitData);
      setStandardHabitData(habitData);
    } catch (error) {
      console.error("Error updating habit data:", error);
    }
  };

  useEffect(() => {
    console.log("Standard data", standardHabitData)
    if (standardHabitData && standardHabitData.id) {
      updateHabitData();
    }
  }, [standardHabitData.id, lastUpdateTimestamp]);

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
          <View className="p-4 flex flex-row ">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white">BACK</Text>
            </TouchableOpacity>
            <View className="flex-1 flex items-center">
              <Text className="text-2xl text-white">{standardHabitData.name}</Text>
            </View>
            <View>
              <Link
                 href={{
                  pathname: '/(app)/habitEditor',
                  params: { data: JSON.stringify(standardHabitData), adaptiveSuggestion: null}
                }}
              >
                <Text className="text-white">EDIT</Text>
              </Link>
            </View>
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
