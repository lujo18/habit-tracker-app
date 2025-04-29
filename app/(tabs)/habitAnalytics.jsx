import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CartesianAnalytics from "../../components/CartesianAnalytics";
import { HabitHistoryRepository } from "../../db/sqliteManager";
import tailwindConfig from "../../tailwind.config";
import Calendar from "../../components/Calendar";
import Habit from "../../components/Habit";

const habitAnalytics = () => {
  const data = useLocalSearchParams();
  const router = useRouter();

  const habitHistoryRepo = new HabitHistoryRepository();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [chartData, setChartData] = useState([]);
  const tailwindColors = tailwindConfig.theme.extend.colors;

  useEffect(() => {
    try {
      const getData = async () => {
        const date = new Date("2024-12-01");

        const historyData = await habitHistoryRepo.getProceedingLogs(
          date,
          parseInt(data.id)
        );

        setChartData(historyData);
      };

      getData();
    } catch (r) {
      console.log("Analytics error,", r);
    }
  }, [data.id]);

  const setDate = async (value) => {
    setSelectedDate(new Date(value));
  };

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

          {/*<CartesianAnalytics
            data={chartData}
            xKey={"date"}
            yKeys={["completionCount"]}
          />*/}

          <Calendar selectedDay={selectedDate} setSelectedDay={setDate} />

          <View className="w-full p-4">
            <Habit data={data} canSubtract={true} />
          </View>

          <Text className="text-white">{JSON.stringify(data)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default habitAnalytics;
