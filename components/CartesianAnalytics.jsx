import {
  View,
  Text,
  Modal,
  Button,
  FlatList,
  Touchable,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  CartesianChart,
  useAnimatedPath,
  useAreaPath,
  useChartPressState,
  useLinePath,
  Bar,
} from "victory-native";
import {
  Circle,
  DashPathEffect,
  LinearGradient,
  Path,
  Points,
  vec,
  Skia,
  Font,
  FontStyle,
  Line,
  Rect,
  Text as SkiaText,
  Canvas,
  useFont,
} from "@shopify/react-native-skia";
import tailwindConfig from "../tailwind.config";
import { useDerivedValue } from "react-native-reanimated";
import { formatChartData } from "../utils/dateRetriver";
import TextButton from "./TextButton";
import Header from "./Text/Header";

import * as Haptics from 'expo-haptics'

const tailwindColors = tailwindConfig.theme.extend.colors;

const CartesianAnalytics = ({ data, xKey, yKeys, label }) => {
  if (!data) {
    return null;
  }

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { completionCount: 0, growth: 0 },
  });

  const subFont = useFont(
    require("../assets/fonts/Lora/Lora-MediumItalic.ttf"),
    14
  );
  const font = useFont(
    require("../assets/fonts/GeneralSans/GeneralSans-Medium.otf"),
    28
  );

  const [valueCanvasSize, setValueCanvasSize] = useState({
    width: 0,
    height: 0,
  });

  const [timeFrame, setTimeFrame] = useState(0);

  const [timeframeChartData, setTimeframeChartData] = useState([]);
  const [timeframeGrowthData, setTimeframeGrowthData] = useState([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const daysSinceStart =
    Math.floor((new Date() - new Date(data[0]?.date)) / (1000 * 60 * 60 * 24)) +
    1;

  const timeframeOptions = [
    { timeframe: 30, name: "30" },
    { timeframe: 60, name: "60" },
    { timeframe: 180, name: "180" },
    { timeframe: 365, name: "365" },
    { timeframe: daysSinceStart, name: "All" },
  ];

  useEffect(() => {
    setTimeFrame(30);
  }, []);




  useEffect(() => {
    // take the timeframe
    // find the date "timeframe" away in the past then create an array with those dates up until now
    // replace the dates that are in the array with the ones that actually exist\

    // V2
    // take the timeframe
    // find the "start date"
    // pass the current data
    // go through the data while going through every date from start until now
    // if the date isn't existing in data, add a "temp" object with a value of 0 and the date filled in

    const temp = async () => {
      const newData = await formatChartData(data, timeFrame);
      setTimeframeChartData(newData);

      let value = 0;
      setTimeframeChartData(
        newData.map((date, index) => {
          return { ...date, growth: (value += date.completionCount) };
        })
      );
    };

    temp();
  }, [timeFrame, data]);

  try {
    // AreaChart component to render the area chart

    const AreaChart = ({ points, bottom, height }) => {
      const topPadding = 40

      const maxGrowth = Math.max(...timeframeChartData.map((d) => d.growth), 1)
      
      const scaledPoints = points.map((point) => ({
        ...point,
        y: (topPadding + (1 - point.yValue / maxGrowth) * (height - topPadding))
      }))

      const { path } = useAreaPath(scaledPoints, bottom, { curveType: "bumpX" }); // Use curveLinear
      const { path: linePath } = useLinePath(scaledPoints, {
        curveType: "bumpX",
      });
      // Calculate the x position up to which the fill should be white

      // Create two paths: one for the filled (white) area, one for the rest (transparent)
      // Skia doesn't support direct path clipping, so we overlay two Paths with different fills and clipRects

      return (
        <>
          {/* White fill up to the current position */}
          <Path
            path={path}
            style="fill"
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={["white", "transparent"]}
            />
          </Path>
          {/* Rest of the area with original color */}
          
          <Path path={linePath} style="stroke" strokeWidth={2} color="white" />
        </>
      );
    };

    const CustomBarChart = ({ points, chartBounds, canvasSize }) => {
      
      const barChartTop = canvasSize.height * 0.75;
      const barChartHeight = canvasSize.height * 0.25;
      const maxCompletion = Math.max(...timeframeChartData.map((d) => d.completionCount), 1)
      
      const scaledPoints = points.map((point) => ({
        ...point,
        y:(barChartTop + (1 - point.yValue / maxCompletion) * barChartHeight)
      }))

      return (
        <Bar
          chartBounds={{...chartBounds, top: barChartTop, bottom: barChartTop + barChartHeight}}
          points={scaledPoints}
          roundedCorners={{
            topLeft: 5,
            topRight: 5,
          }}
          color={"white"}
        />
      );
    };

    const UnifiedToolTip = ({ chartBounds, height, canvasSize }) => {
      if (!font || !state) return null;

      const x = state.x.position;
      //const yGrowth = state.y.growth.position;
      //const yCompletion = state.y.completionCount.position;
      const closestDataPoint = useDerivedValue(() => {
        const xValue = state.x.value.value;
        return timeframeChartData.reduce((prev, curr) =>
          Math.abs(new Date(curr[xKey]).getTime() - new Date(xValue).getTime()) <
          Math.abs(new Date(prev[xKey]).getTime() - new Date(xValue).getTime())
            ? curr
            : prev
        );
      }, [state]);

      


      const yGrowth = useDerivedValue(() => {
        const lineChartTop = 40;
        const lineChartHeight = canvasSize.height * 0.75;
        const maxGrowth = Math.max(...timeframeChartData.map((d) => d.growth), 1)
        const pointValue = closestDataPoint.value.growth.toFixed(0)

        return lineChartTop + (1 - pointValue / maxGrowth) * (lineChartHeight - lineChartTop)
      }, [state])

      const yCompletion = useDerivedValue(() => {
        const barChartTop = canvasSize.height * 0.75;
        const barChartHeight = canvasSize.height * 0.25;
        const maxCompletion = Math.max(...timeframeChartData.map((d) => d.completionCount), 1)
        const pointValue = closestDataPoint.value.completionCount.toFixed(0)

        return barChartTop + (1 - pointValue / maxCompletion) * barChartHeight
      }, [state])


      const selectedGrowth = useDerivedValue(
        () => closestDataPoint.value.growth.toFixed(0),
        [closestDataPoint]
      );

      const selectedCompletion = useDerivedValue(
        () => closestDataPoint.value.completionCount.toFixed(0),
        [closestDataPoint]
      );

      const tipPaddingX = 12;
      const tipPaddingY = 10;
      const tipTextGap = 2;

      const tipMargin = 10;

      const selectedDate = useDerivedValue(() => {
        return state.x.value.value;
      }, [state]);

      // Haptic feedback when state changes (on chart press/move)
      // Use a Reanimated hook to react to changes in x.value and isActive
      React.useEffect(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        let lastX = null;
        let lastActive = false;
        if (!isActive) return;
        const interval = setInterval(() => {
          if (isActive && x?.value !== lastX) {
            lastX = x?.value;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }, 50);
        return () => clearInterval(interval);
      }, [isActive, x]);

      const dateMetrics = font.measureText(selectedDate.value);
      const valueMetrics = font.measureText(selectedCompletion.value);

      const tipWidth =
        Math.max(dateMetrics.width, valueMetrics.width) + tipPaddingX * 2;
      const tipHeight =
        dateMetrics.height + valueMetrics.height + tipTextGap + tipPaddingY * 2;

      if (timeframeChartData?.length < 1) {
        return null;
      }

      return (
        <>
          <Rect x={x} y={0} height={height} width={1} color={"white"} />
          <Rect
            x={0}
            y={yCompletion}
            height={1}
            width={chartBounds.right - chartBounds.left}
            color={"white"}
          />
          <Circle cx={x} cy={yGrowth} r={7} color={"black"} strokeWidth={1} />
          <Circle cx={x} cy={yGrowth} r={5} color={"white"} strokeWidth={1} />
          <Circle
            cx={x}
            cy={yCompletion}
            r={7}
            color={"black"}
            strokeWidth={1}
          />
          <Circle
            cx={x}
            cy={yCompletion}
            r={5}
            color={"white"}
            strokeWidth={1}
          />
        </>
      );
    };

    const ValueTooltip = ({ chartBounds, height, width }) => {
      if (!font || !state) return null;

      const x = state.x.position;
      const yGrowth = state.y.growth.position;
      const yCompletion = state.y.completionCount.position;

      const xValue = state.x.value.value; // The x-axis value (e.g., date)

      const selectedGrowth = useDerivedValue(
        () => state.y.growth.value.value.toFixed(0),
        [state]
      );

      const selectedCompletion = useDerivedValue(
        () => state.y.completionCount.value.value.toFixed(0),
        [state]
      );
      const selectedDate = useDerivedValue(
        () =>
          new Date(state.x.value.value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        [state]
      );

      const tipPaddingX = 12;
      const tipPaddingY = 10;
      const tipTextGap = 2;
      const tipMargin = 10;

      const dateMetrics = font.measureText(selectedDate.value);
      const growthMetrics = font.measureText(selectedGrowth.value);
      const completionMetrics = font.measureText(selectedCompletion.value);

      const tipWidth = Math.max(dateMetrics.width, growthMetrics.width); //+ (tipPaddingX * 2)
      const tipHeight = dateMetrics.height + growthMetrics.height + tipTextGap; //+ (tipPaddingY * 2)

      const dateX = useDerivedValue(() => {
        const newPos = x.value - tipWidth / 4;
        return newPos < 0
          ? 0
          : newPos + tipWidth / 2 > valueCanvasSize.width
          ? valueCanvasSize.width - tipWidth / 2
          : newPos;
      }, [x, valueCanvasSize]);
      const dateY = useDerivedValue(() => tipPaddingY, []);
      const growthX = useDerivedValue(() => dateX.value, [dateX]);
      const growthY = useDerivedValue(
        () => dateMetrics.height + tipPaddingY + tipTextGap,
        []
      );
      const completionX = useDerivedValue(() => dateX.value, [dateX]);
      const completionY = useDerivedValue(
        () =>
          dateMetrics.height +
          growthMetrics.height +
          tipPaddingY +
          tipTextGap * 2,
        []
      );

      return (
        <>
          <SkiaText
            x={dateX}
            y={dateY}
            text={selectedDate}
            font={subFont}
            color={tailwindColors["highlight"][70]}
          />
          <SkiaText
            x={growthX}
            y={growthY}
            text={selectedGrowth}
            font={font}
            color={"white"}
          />
        </>
      );
    };

    return (
      <>
        <View className="w-full relative">
          <View
            className="relative h-14 w-full"
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setValueCanvasSize({ width, height });
            }}
          >
            <View
              className={`${isActive && "opacity-0"} absolute left-0 top-0`}
            >
              <Header>Habit Analytics</Header>
              <Text className="text-highlight-70 font-generalsans-medium text-lg">
                Timeframe: {timeFrame} days
              </Text>
            </View>
            <Canvas // 56px = 14 * 4 (rem to px)
              width={valueCanvasSize.width} // Set an explicit width (adjust as needed)
              height={valueCanvasSize.height} // Set an explicit height (adjust as needed)
              pointerEvents="none"
            >
              {isActive && (
                <ValueTooltip
                  chartBounds={{ top: 0, bottom: 400 }}
                  height={400}
                  width={valueCanvasSize.width}
                />
              )}
            </Canvas>
          </View>

          <View className="w-full h-[400px]">
            <CartesianChart
              data={timeframeChartData}
              xKey={xKey}
              yKeys={[...yKeys, "growth"]}
              domainPadding={{ top: 40, bottom: 0 }}
              xAxis={{
                lineColor: tailwindColors["background"][80],
                lineWidth: 2,
                linePathEffect: <DashPathEffect intervals={[4, 4]} />,
              }}
              yAxis={[{ domain: [0, undefined] }]}
              axisOptions={{ font, labelColor: "white" }}
              chartPressState={state}
            
            >
              {({ points, chartBounds, canvasSize }) => {
                // Ensure points and chartBounds are valid

                if (!points || !chartBounds) {
                  console.log("poings or chartBounds are null");
                  return null;
                }
                return (
                  <>
                    <AreaChart
                      points={points.growth}
                      bottom={chartBounds.bottom * 0.75}
                      height={canvasSize.height * 0.75}
                    />

                    <CustomBarChart
                      points={points.completionCount}
                      chartBounds={chartBounds}
                      canvasSize={canvasSize}
                    />
                    {isActive && (
                      <UnifiedToolTip
                        chartBounds={chartBounds}
                        height={canvasSize.height}
                        canvasSize={canvasSize}
                      />
                    )}
                  </>
                );
              }}
            </CartesianChart>
          </View>
          <TouchableOpacity
            onPress={() => {
              setFilterModalOpen(true);
            }}
            className="bg-background border-2 border-background-90 p-4"
          >
            <Text className="text-highlight font-generalsans-medium textlg">
              Chart Options
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={filterModalOpen}
          animationType="slide"
          transparent={true}
          onDismiss={() => {
            setFilterModalOpen(false);
          }}
        >
          <SafeAreaView
            className="absolute bottom-0 bg-background-90 w-full z-10 rounded-t-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 50 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="p-4">
              <View>
                <Header>Statistics</Header>

                <Header>Time Frame</Header>
                <FlatList
                  data={timeframeOptions}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`w-min flex justify-center items-center border-2 border-background-70 p-4 rounded-xl ${
                        timeFrame == item.timeframe && "bg-background-70"
                      }`}
                      onPress={() => setTimeFrame(item.timeframe)}
                      style={{ aspectRatio: "1/1" }}
                    >
                      <Text className="text-highlight">{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.name}
                  horizontal
                  contentContainerStyle={{
                    justifyContent: "space-evenly",
                    width: "99%",
                  }}
                  className="w-full my-4"
                />
              </View>
              <View>
                <TextButton
                  text="Close"
                  onPress={() => {
                    setFilterModalOpen(false);
                  }}
                  containerStyles={`flex-1`}
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </>
    );
  } catch (err) {
    console.log("Failed to load graph ", err);
  }
};

export default CartesianAnalytics;
