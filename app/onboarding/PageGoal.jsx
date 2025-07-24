import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import SwitchCheck from "../../components/SwitchCheck";

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
  Purpose: false
}


const minSelect = 2
const maxSelect = 6

const PageGoal = ({goToPage, fullScreenGradient, submitAreaPreferences}) => {

  const [lifeAreas, setLifeAreas] = useState(areaOptions)

  const lifeAreasArray = Object.entries(lifeAreas).map(([key, value]) => ({
    name: key,
    selected: value
  }))

  const handleAreaToggle = (areaName) => {
    if ( numChecked + 1 < maxSelect || lifeAreas[areaName] === true) {
      setLifeAreas(prev => ({
        ...prev, 
        [areaName]: !prev[areaName]
      }));
    }
  }

  const numChecked = lifeAreasArray.reduce((acc, area) => acc + (area.selected ? 1 : 0), 0 )

  return (
    <View className="flex flex-1 w-full items-center justify-between gap-4 py-8">
      <View className="px-8">
        <View className="mb-8 gap-2 scale-125 items-center">
          <XLHeader>What areas do you {"\n"} want to <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">improve</Text>?</XLHeader>
        </View>
        <View className="gap-4">
          <Subheader>Select some of the areas you want to improve.</Subheader>
          <Subheader>We will give taylored suggestions based on what you choose.</Subheader>
        </View>
      </View>
      <ScrollView className="w-full px-8 py-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-4">
          {lifeAreasArray.map((area, idx) => (
            <SwitchCheck key={idx} index={idx} value={area.selected} label={area.name} onToggle={() => handleAreaToggle(area.name)} />
          ))}
        </View>
      </ScrollView>
      <View className="px-8 w-full items-center justify-between gap-4">
        <Header>{numChecked - minSelect < 0 ? `Select at least ${minSelect - numChecked} more.` : ' '}</Header>
        <View className="w-full">
          <View className="flex-row">
            <TextButton
              disabled={numChecked - minSelect < 0}
              type="solid"
              text="See Habits Built for You"
              onPress={() => {
                goToPage(5);
                submitAreaPreferences(lifeAreasArray)
                fullScreenGradient(true);
                setTimeout(() => {
                  fullScreenGradient(false)
                }, 2000); //FIX ME make it 10000
                
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PageGoal;
