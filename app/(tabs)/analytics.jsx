import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { DateContext } from "../../contexts/DateContext";
import { CartesianChart, Line, Area } from "victory-native";
import { dateToSQL, HabitHistoryRepository } from "../../db/sqliteManager";
import tailwindConfig from "../../tailwind.config";
import CartesianAnalytics from "../../components/CartesianAnalytics";
import { FontStyle, Skia } from "@shopify/react-native-skia";

const Analytics = () => {
  const habitHistoryRepo = new HabitHistoryRepository();


  const [chartData, setChartData] = useState([]);
  const tailwindColors = tailwindConfig.theme.extend.colors 
  useEffect(() => {
    const getData = async () => {
      const date = new Date("2024-12-01");
      const data = await habitHistoryRepo.getProceedingLogs(
        await dateToSQL(date),
        3
      );
      setChartData(data);
    };

    getData();
  }, []);

  return (
    <SafeAreaView className="bg-background h-full w-full px-4 flex-1">
      <View className="flex-row align-center  p-4">
        <View className="flex-1 items-center">
          <Text className="text-highlight text-2xl">Analytics</Text>
         
          <CartesianAnalytics 
            data={chartData}
            xKey={"date"}
            yKeys={["completionCount"]}
          />

          {/*chartData.length > 0 && (
            <View className="h-[300px] w-full">
              <CartesianChart
                data={chartData}
                xKey={"date"}
                yKeys={["completionCount", "goal"]}
                padding={{ top: 40, left: 20, bottom: 40, right: 20 }}
                xAxis={{ lineColor: tailwindColors["background"][80], labelColor: tailwindColors["highlight"][60], tickCount: chartData.length}}
                frame={{ lineColor: tailwindColors["background"][90], lineWidth: 2 }}
                domain={{ y: [0, chartData[0].goal + chartData[0].goal / 2] }}
              >
                {({ points, chartBounds }) => (
                  <>
                    
                    <Area
                      points={points.completionCount}
                      y0={chartBounds.bottom}
                      color={tailwindColors["habitColors"]["hBlue"]}
                      strokeWidth={3}
                      animate={{ type: "spring", duration: 300 }}
                      curveType="linear"
                    />
                    <Line
                      points={points.goal}
                      color="white"
                      strokeWidth={3}
                      
                      animate={{ type: "spring", duration: 300 }}
                      curveType="linear"
                    />
                  
                  </>
                )}
              </CartesianChart>
            </View>
          )*/}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Analytics;
