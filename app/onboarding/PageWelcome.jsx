import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import Animated, { Easing, FadeInDown, FadeInUp } from "react-native-reanimated";

const PageWelcome = ({goToPage}) => {
  return (
    <View className="flex flex-1 w-full items-center justify-between p-8">
      <View></View>
      <View>
        <View className="mb-8 gap-2 scale-125">
          <XLHeader>Most people die with</XLHeader>
          <View className="flex-row gap-4">
            <XLHeader>regrets.</XLHeader>
            <XLHeader>
              <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">
                You
              </Text>{" "}
              won't.
            </XLHeader>
          </View>
        </View>
        <View className="items-center">
          <Subheader>This isn't a habit tracker.</Subheader>
          <Subheader>It's a weapon against who you</Subheader>
          <Subheader>don't want to become.</Subheader>
        </View>
      </View>
      <View className="w-full">
        <RegretCarousel />
        <Animated.View className="flex-row" entering={FadeInDown.duration(500).delay(1000).easing(Easing.ease)}>
          <TextButton type="solid" text="Take the Quiz" onPress={() => goToPage(1)} />
        </Animated.View>
      </View>
    </View>
  );
};

export default PageWelcome;
