import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import icons from "../constants/icons";
import Habit from "./Habit";
import QuitHabit from "./QuitHabit";

const HabitGroup = memo(({ group, habits, onTimerResetOpen }) => {
  const initialLayoutComplete = useRef(false)
  const heightsMapRef = useRef(new Map())

  const [contentHeight, setContentHeight] = useState(null);

  const isOpen = useSharedValue(true); // Flag to indicate measurement completion

  useEffect(() => {
    if (heightsMapRef.current.has(group.type)) {
      const storedHeight = heightsMapRef.current.get(group.type)
      setContentHeight(storedHeight)
    }
  }, [group.type]);

  // Animated style for the Animated.View
  const animatedStyle = useAnimatedStyle(() => {
    if (contentHeight === null) {
      return { opacity: 1 };
    }

    return {
      height:
        withTiming(isOpen.value ? contentHeight : 0, {
          easing: Easing.out(Easing.exp),
          duration: 600,
        }),
      opacity: withTiming(isOpen.value ? 1 : 0, { duration: 500 }),
      overflow: "hidden",
    };
  }, [contentHeight]);

  const closeHabitGroup = useCallback(
    (groupTYpe, visibility) => {
      if (isOpen.value !== visibility) {
        isOpen.value = visibility;
      }
    }, [isOpen]
  );

  const filteredHabits = habits.filter((habit) => habit.repeat === group.type);

  const RepeatHeaders = useCallback(
    ({ group }) => {
      const [isAnimating, setIsAnimating] = useState(false);

      const toggleGroup = () => {
        if (contentHeight === null) return;

        setIsAnimating(true);
        closeHabitGroup(group.type, !isOpen.value);
        setTimeout(() => {
          setIsAnimating(false);
        }, 600);
      };

      return (
        <TouchableOpacity onPress={toggleGroup} disabled={isAnimating}>
          <View className="flex-row items-center gap-2 my-2">
            <Image
              source={icons.dropdown}
              className={`w-8 h-8 ${true ? "rotate-180" : "rotate-0"}`}
              contentFit="contain"
            />
            <Image
              source={group.icon}
              className="w-8 h-8"
              contentFit="contain"
            />
            <Text className="text-highlight-70 text-lg font-lora-semibold-italic">
              {group.label} Habits
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [contentHeight, isOpen.value, closeHabitGroup]
  );

  if (filteredHabits.length === 0) {
    return null;
  }

  return (
    <View>
      <RepeatHeaders group={group} />
      <Animated.View style={[animatedStyle, { position: "relative" }]}>
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;

            if (height > 0) {
              heightsMapRef.current.set((group.type, height))
              setContentHeight(height);
              initialLayoutComplete.current = true;
            }
          }}
          style={{ position: "absolute", right: 0, left: 0 }}
        >
          <FlatList
            data={filteredHabits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return item.repeat === "forever" ? (
                <QuitHabit
                  key={item.id.toString()}
                  data={item}
                  handleReset={onTimerResetOpen}
                />
              ) : (
                <Habit key={item.id.toString()} data={item} />
              );
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
});

export default HabitGroup;
