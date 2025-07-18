import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import icons from "../constants/icons";

import { Canvas, Rect, SweepGradient, vec } from "@shopify/react-native-skia";
import Animated, {
  interpolate,
  useSharedValue,
  withReanimatedTimer,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";
import tailwindConfig from "../tailwind.config";
import { HabitHistoryRepository } from "../db/sqliteManager";
import { DateContext, useDateContext } from "../contexts/DateContext";
import { useLoading } from "./LoadingProvider";
import { formatRepeatText } from "../utils/formatters";
import { Link } from "expo-router";
import { setDate } from "date-fns";

// onPress: function ran when clicking habit's button (can vary for normal and timer based habits)
const HabitBase = ({
  data,
  habitCompletionDisplay,
  habitButton,
  habitSubtractButton,
  enableStreak = false,
  currentStreak = 0,
  amount = 0,
  goal,
  isCompleted = false,
  ...props
}) => {
  const { selectedDate } = useDateContext();

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const { name, repeat, color } = data;

  const borderColor = color;
  const bgColor = `bg-[${color}]`;
  const backgroundColor =
    tailwindConfig.theme.extend.colors["background"]["90"];
  const tailwindColors = tailwindConfig.theme.extend.colors;

  const HabitStreak = () => {
    return (
      <View className="flex-row items-center justify-start">
        <Text
          className={`text-2xl font-lora-semibold-italic ${
            isCompleted ? "text-highlight" : "text-background-70"
          } `}
        >
          {currentStreak}
        </Text>

        <Image
          source={icons.streakFire}
          resizeMode="contain"
          className="h-6 w-6"
          tintColor={
            isCompleted
              ? tailwindColors["highlight"]["80"]
              : tailwindColors["background"]["70"]
          }
        />
      </View>
    );
  };

  return (
    <View
      className="rounded-2xl overflow-hidden justify-center relative items-center my-4 p-1"
      onLayout={({ nativeEvent: { layout } }) => {
        setCanvasSize(layout);
      }}
    >
      <View
        className={`${
          amount < goal ? "bg-background-90" : bgColor
        } flex-row w-full gap-3 rounded-2xl z-10 p-3`}
      >
        {habitSubtractButton && habitSubtractButton()}

        <Link
          className="flex-1"
          href={{
            pathname: "/(app)/habitAnalytics",
            params: { data: JSON.stringify(data), selectedDate },
          }}
        >
          <View className="flex-1 flex flex-row justify-between">
            <View className="flex-1 gap-2">
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2">
                  { data.setting === 'dynamic' && <Image
                    source={icons.shining}
                    className="w-6 h-6"
                    contentFit="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                  />}
                  <Text className="text-highlight text-2xl font-generalsans-semibold">
                    {name}
                  </Text>
                </View>

                {enableStreak && <HabitStreak />}
              </View>
              {/** contains current completion under habit name (x/y label | x time) */}
              {habitCompletionDisplay()}
            </View>

            <View>
              <View className="p-2">
                <Text className="text-highlight-60 text-lg font-generalsans-medium">
                  {formatRepeatText(repeat)}
                </Text>
              </View>
            </View>
          </View>
        </Link>

        {habitButton()}
      </View>

      <Canvas
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      >
        <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height}>
          <SweepGradient
            origin={vec(canvasSize.width / 2, canvasSize.height / 2)}
            c={vec(canvasSize.width / 2, canvasSize.height / 2)}
            colors={[
              borderColor,
              borderColor,
              backgroundColor,
              backgroundColor,
            ]}
            positions={[
              0,
              goal > 0 ? Math.min(Math.max(amount / goal, 0), 1) : 0,
              goal > 0
                ? Math.min(Math.max(amount / (goal - goal / 7), 0), 1)
                : 0,
              1,
            ]}
            transform={[{ rotate: -Math.PI / 2 }]}
          />
        </Rect>
      </Canvas>
    </View>
  );
};

export default HabitBase;
