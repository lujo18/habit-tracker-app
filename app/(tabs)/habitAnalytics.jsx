import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CartesianAnalytics from "../../components/CartesianAnalytics";
import { HabitHistoryRepository } from "../../db/sqliteManager";
import tailwindConfig from "../../tailwind.config";
import Calendar from "../../components/Calendar";
import Habit from "../../components/Habit";
import { DateContext, useDateContext } from "../../contexts/DateContext";
import HeatMapCalendar from "../../components/HeatMapCalendar";

const habitAnalytics = () => {
  const params = useLocalSearchParams()
  const data = JSON.parse(params.data)
  
  //const date = new Date(params.selectedDate);
  //date.setDate(date.getDate() - 1);
  const router = useRouter();

  const {selectedDate, setSelectedDate} = useDateContext()

  const habitHistoryRepo = new HabitHistoryRepository();

  const [analyticDate, setAnalyticDate] = useState(selectedDate);

  const [chartData, setChartData] = useState([]);
  const tailwindColors = tailwindConfig.theme.extend.colors;

  const [selectedAmount, setSelectedAmount] = useState(0)

  useEffect(() => {
    setAnalyticDate(selectedDate)
  }, [selectedDate])

  const getData = async () => {
    const date = new Date("2024-12-01");
    const historyData = await habitHistoryRepo.getAllHistory(parseInt(data.id))

    setChartData(historyData);
  };

  useEffect(() => {
    try {
      getData();
    } catch (r) {
      console.log("Analytics error,", r);
    }
  }, [data.id]);

  const setDate = async (value) => {
    getData()
    //setAnalyticDate(new Date(value));
    setSelectedDate(new Date(value))
    setAnalyticDate(new Date(value))
  };

  const updateSelectedAmount = (amount) => {
    setSelectedAmount(amount)
  }
  
  return (
    <SafeAreaView className="w-full h-full bg-background-90">
      <ScrollView>
        <View className="p-4 flex-row">
          <TouchableOpacity className="flex-1" onPress={() => router.back()}>
            <Text className="text-white">BACK</Text>
          </TouchableOpacity>
          <Text className="flex-2 text-2xl text-white">{data.name}</Text>
          <View className="flex-1"></View>
        </View>
        
        <View className="flex-1 bg-background items-center h-full w-full">
          {/*<Text className='text-white'>{JSON.stringify(chartData)}</Text>*/}

          <CartesianAnalytics
            data={chartData}
            xKey={"date"}
            yKeys={["completionCount"]}
          />

          <HeatMapCalendar habitHistory={chartData} selectedDay={analyticDate} setSelectedDay={setDate} color={data.color} selectedAmount={selectedAmount}/>

          <View className="w-full p-4">
            <Habit data={data} canSubtract={true} updateSelectedAmount={updateSelectedAmount}/>
          </View>

          {/*<Text className="text-white">{JSON.stringify(data)}{JSON.stringify(analyticDate)}</Text>*/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default habitAnalytics;
