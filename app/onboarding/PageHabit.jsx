import {
  View,
  Text,
  FlatList,
  ScrollView,
  LayoutAnimation,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import SwitchCheck from "../../components/SwitchCheck";
import Animated, {
  FadingTransition,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

import deepHabitSuggestions from "../../constants/deepHabitSuggestions.json";
import Habit from "../../components/Habit";
import HabitSwitchCheck from "../../components/HabitSwitchCheck";

const loadingAnimation = require("../../assets/animations/NoRedoLoading.json");

const areaOptions = {
  Health: false,
  Fitness: false,
  Focus: false,
  Energy: false,
  Sleep: false,
  Discipline: false,
  Gratitude: false,
  Relationships: false,
  Spirituality: false,
  Creativity: false,
  Productivity: false,
  Confidence: false,
  Time: false,
  Mood: false,
  Purpose: false,
};

const archetypeDescriptions = {
  drifter: {
    title: "The Drifter",
    whyHabitsChosen:
      "Habits were chosen to help you gain clarity, structure, and momentum.",
  },
  staller: {
    title: "The Staller",
    whyHabitsChosen:
      "Habits encourage you to start, build momentum, and overcome procrastination.",
  },
  burner: {
    title: "The Burner",
    whyHabitsChosen:
      "Habits support pacing yourself and building consistent progress.",
  },
  pleaser: {
    title: "The Pleaser",
    whyHabitsChosen:
      "Habits help you focus on your own values and build self-motivation.",
  },
  skeptic: {
    title: "The Skeptic",
    whyHabitsChosen:
      "Habits provide clear wins and evidence of progress to build trust.",
  },
};

const minSelect = 1;
const maxSelect = 3;

const PageHabit = ({
  goToPage,
  gradientFullScreen,
  areaPreferences,
  userArchetype,
  addHabits
}) => {

  const animation = useRef(null);

  const [relevantHabits, setRelevantHabits] = useState([]);

  const [selectedHabits, setSelectedHabits] = useState([]);

  const getRelevantHabits = () => {
    if (!areaPreferences || areaPreferences.length === 0) {
      return Object.values(deepHabitSuggestions).flat();
    }

    const relevantHabits = areaPreferences.reduce((acc, area) => {
      if (deepHabitSuggestions[userArchetype][area]) {
        return [
          ...acc,
          ...deepHabitSuggestions[userArchetype][area].map((val) => ({
            ...val,
          })),
        ];
      }
      return acc;
    }, []);

    console.log("RH", relevantHabits);

    return relevantHabits;
  };

  const handleAreaToggle = (habit) => {
    if (numChecked + 1 < maxSelect || selectedHabits.includes(habit)) {
      setSelectedHabits((prev) => {
        if (prev.includes(habit)) {
          return prev.filter((selected) => selected != habit);
        } else {
          return [...prev, habit];
        }
      });
    }
  };

  const numChecked = selectedHabits.length;

  useEffect(() => {
    setRelevantHabits(getRelevantHabits);
  }, [areaPreferences]);

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      layout={FadingTransition.duration(1000)}
    >
      {gradientFullScreen ? (
        // <LottieView style={{width: "50%", height:"50%"}} autoPlay={true} ref={animation} source={loadingAnimation}/>
        <Header>Loading...</Header>
      ) : (
        <View className="flex flex-1 w-full items-center justify-between gap-4 py-8">
          <View className="px-8 ">
            <View className="mb-8 gap-2 scale-125 items-center">
              <XLHeader>
                We've generated {"\n"}some{" "}
                <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">
                  habits
                </Text>{" "}
                for you.
              </XLHeader>
            </View>
            <View className="gap-4">
              <Subheader>
                Since you align with {" "}
                <Text className="font-lora-bold italic color-habitColors-blue-up">
                  "{archetypeDescriptions[userArchetype]?.title}"
                </Text>
                . {archetypeDescriptions[userArchetype]?.whyHabitsChosen}
              </Subheader>
            </View>
          </View>

          <ScrollView
            className="w-full px-8 py-4"
            showsVerticalScrollIndicator={false}
          >
            {areaPreferences.map((area, idx) => (
              <Animated.View
                key={idx}
                layout={LinearTransition.springify(3000)
                  .damping(15)
                  .mass(1)
                  .stiffness(500)
                  .overshootClamping(false)
                  .restDisplacementThreshold(1)
                  .restSpeedThreshold(1)}
                className={"gap-4"}
              >
                <Header>
                  <Text className="font-lora-bold text-2xl italic color-habitColors-blue-up">
                    {userArchetype}
                  </Text>{" "}
                  - {area}
                </Header>
                <View className="flex-row flex-wrap gap-4">
                  {relevantHabits
                    .filter((habit) => habit.area === area)
                    .map((area, idx) => (
                      <HabitSwitchCheck
                        key={idx}
                        value={selectedHabits.includes(area)}
                        data={area}
                        onToggle={() => handleAreaToggle(area)}
                      />
                    ))}
                </View>
              </Animated.View>
            ))}
          </ScrollView>
          <View className="px-8 w-full items-center justify-between gap-4">
           
            <Header>
              {numChecked - minSelect < 0
                ? `Select at least ${minSelect - numChecked} more.`
                : " "}
            </Header>
            <View className="w-full">
              <View className="flex-row">
                <TextButton
                  disabled={numChecked - minSelect < 0}
                  type="solid"
                  text="Add These Habits"
                  onPress={() => {goToPage(6), addHabits}}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default PageHabit;
