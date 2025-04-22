import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import icons from '../constants/icons'

import { Canvas, Rect, SweepGradient, vec} from '@shopify/react-native-skia'
import Animated, { interpolate, useSharedValue, withReanimatedTimer, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated'
import tailwindConfig from '../tailwind.config'
import { HabitHistoryRepository } from '../db/sqliteManager'
import { DateContext } from '../contexts/DateContext'
import { useLoading } from './LoadingProvider'
import { formatRepeatText } from '../utils/formatters'

// onPress: function ran when clicking habit's button (can vary for normal and timer based habits)
const HabitBase = ({ data, habitCompletionDisplay, habitButton, enableStreak = false, currentStreak = 0, amount = 0, isCompleted = false, ...props }) => {

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const {name, repeat, color, goal} = data

  const borderColor = color
  const backgroundColor = tailwindConfig.theme.extend.colors["background"]["90"]
  const tailwindColors = tailwindConfig.theme.extend.colors

  const HabitStreak = () => {
    return (
      <View className="flex-row items-center justify-start">
        <Text
          className={`text-xl ${
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
    )
  }

  return (
    
    <View
      className="rounded-2xl overflow-hidden justify-center relative items-center p-1 my-4"
      onLayout={({ nativeEvent: { layout } }) => {
        setCanvasSize(layout);
      }}
    >
      <View
        className={`${
          amount < goal ? "bg-background-90" : `bg-[${color}]`
        } flex-row w-full p-5 gap-3 rounded-2xl z-10`}
      >
        <View className="flex-1 gap-2">
          <View className="flex-row items-center gap-4">
            <Text className="text-highlight text-2xl">{name}</Text>
            
            {enableStreak && <HabitStreak />}
          </View>

          {/** contains current completion under habit name (x/y label | x time) */}
          { habitCompletionDisplay() }

        </View>
        <View>
          <View className="p-2">
            <Text className="text-highlight-60">
              {formatRepeatText(repeat)}
            </Text>
          </View>
        </View>

        { habitButton() }
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
            positions={[0, amount / goal, amount / (goal - goal / 7), 1]}
            transform={[{ rotate: -Math.PI / 2 }]}
          />
        </Rect>
      </Canvas>
    </View>
  );
};

export default HabitBase;
