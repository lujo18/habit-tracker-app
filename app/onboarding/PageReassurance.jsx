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

const PageReassurance = ({goToPage}) => {
  return (
    <View className="flex flex-1 w-full items-center justify-between p-8">
   
      <View>
        <View className="mb-8 gap-8">
          <XLHeader>Don't worry.</XLHeader>
          <View className="gap-2">
            <XLHeader>You're not behind.</XLHeader>
            <View className="flex-row">
              <XLHeader>You're just getting </XLHeader>
              <XLHeader>
                <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">
                  started
                </Text>
                .
              </XLHeader>
            </View>
          </View>
        </View>
        <View className="items-center">
          
        </View>
      </View>
      <View className="w-full">
       
        <View className="flex-row">
          <TextButton type="solid" text="Choose your focuses" onPress={() => goToPage(4)} />
        </View>
      </View>
    </View>
  );
};

export default PageReassurance;
