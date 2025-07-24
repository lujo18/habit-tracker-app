import { View, Text } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import Header from "../../components/Text/Header";

import PageWelcome from "./PageWelcome";
import PageGoal from "./PageGoal";
import PageHabit from "./PageHabit";
import PageQuiz from "./PageQuiz";
import PageQuizResults from "./PageQuizResults";
import PageReassurance from "./PageReassurance";
import PageFeatures from "./PageFeatures";
import { HabitsRepository } from "../../db/sqliteManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const onboardingScreen = () => {
  const HabitRepo = useMemo(() => new HabitsRepository(), [HabitsRepository])

  const pagerRef = useRef(null);

  const [userArchetype, setUserArchetype] = useState("")

  const [areaPreferences, setAreaPreferences] = useState([])

  const goToPage = (index) => {
    pagerRef.current?.setPage(index)
  }
 
  const [gradientFullScreen, setGradientFullScreen] = useState(false)

  const fullScreenGradient = (value) => {
    setGradientFullScreen(value)
  }

  const submitAreaPreferences = async (options) => {
    const preferences = options.map((val) => val.selected === true && val.name).filter((val) => val)
    console.log("Prefs", preferences)
    setAreaPreferences(preferences)
    try {
      await AsyncStorage.setItem("areaPreferences", JSON.stringify(preferences));
      console.log("PREF", await AsyncStorage.getItem("areaPreferences"));
    } catch (error) {
      console.error("Error saving area preferences:", error);
    }
  }

  const setArchetype = async (archetype) => {
    setUserArchetype(archetype)
    try {
      await AsyncStorage.setItem("userArchetype", archetype);
      console.log("ARCH", await AsyncStorage.getItem("userArchetype"));
    } catch (error) {
      console.error("Error saving user archetype:", error);
    }
  }

  const addHabits = async (habits) => {
    for (const habit in habits) {
      await HabitRepo.createHabit(habit)
    }
  }

  return (
    <SafeAreaView className="flex-1 w-full bg-background p-4 gap-4">
      <RadialGlow fullScreen={gradientFullScreen}/>
      <KeyboardAvoidingView
        className="flex-1 w-full justify-center items-center gap-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full items-center">
          <Header>NoRedo</Header>
        </View>
        
          <PagerView
            ref={pagerRef}
            initialPage={0}
            scrollEnabled={false}
            style={{ flex: 1, width: "100%" }}
          >
            <PageWelcome goToPage={goToPage} />
            <PageQuiz goToPage={goToPage} fullScreenGradient={fullScreenGradient} setArchetype={setArchetype}/>
            <PageQuizResults goToPage={goToPage} userArchetype={userArchetype}/>
            <PageReassurance goToPage={goToPage}/>
            <PageGoal goToPage={goToPage} fullScreenGradient={fullScreenGradient} submitAreaPreferences={submitAreaPreferences}/>
            <PageHabit goToPage={goToPage} gradientFullScreen={gradientFullScreen} areaPreferences={areaPreferences} userArchetype={userArchetype} addHabits={addHabits}/>
            <PageFeatures goToPage={goToPage}/>
          </PagerView>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default onboardingScreen;
