import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import icons from "../../constants/icons";
import BasicContainer from "../../components/containers/BasicContainer";
import tailwindConfig from "../../tailwind.config";
import CartesianAnalytics from "../../components/CartesianAnalytics";
import { Link, router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

const tailwindColors = tailwindConfig.theme.extend.colors;

// Demo data for CartesianAnalytics component
const generateDemoData = () => {

  const data = [];
  const today = new Date();

  // Generate 30 days of demo data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0];

    // Generate realistic habit completion data with some variation
    const baseCompletion = 8;
    const variation = Math.floor(Math.random() * 6) - 2; // -2 to +3 variation
    const completionCount = Math.max(
      0,
      Math.min(15, baseCompletion + variation)
    );

    data.push({
      date: formattedDate,
      completionCount: completionCount,
      goal: 10,
    });
  }

  return data;
};

const numPages = 2

const demoChartData = generateDemoData();

const PageFeatures = ({ goToPage }) => {
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0) 

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (page + 1) % numPages;
      pagerRef.current?.setPage(nextPage);
      setPage(nextPage);
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);
 
  const goToFeature = (index) => {
    pagerRef.current?.setPage(index);
  };

  return (
    <View className="flex flex-1 w-full items-center justify-between p-8">
      <View>
        <View className="mb-8 gap-2 scale-125">
          <XLHeader>
            NoRedo is designed to help you live a life you won't{" "}
            <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">
              regret
            </Text>
            .
          </XLHeader>
        </View>
        <View className="items-center mb-2">
          <Subheader>Features:</Subheader>
        </View>
      </View>
      <PagerView
        ref={pagerRef}
        initialPage={0}
        scrollEnabled={true}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        style={{ flex: 1, width: "100%" }}
      >
        <View>
          <XLHeader>Dynamic Habits</XLHeader>
          <Subheader>
            Get challenged when you’re consistent. Rest when you need it.
          </Subheader>

          <View className="gap-2">
            <BasicContainer>
              <View className="mb-2 gap-2">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={icons.shining}
                    className="w-6 h-6"
                    resizeMode="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                  />

                  <XLHeader>Habit</XLHeader>
                </View>
                <View>
                  <Subheader>Increased your goal</Subheader>
                  <Text className="text-background-70 font-generalsans-medium text-sm">
                    You are building momentum. Keep going!
                  </Text>
                </View>
              </View>
              <View className="flex-row w-full justify-evenly">
                <View className="items-center">
                  <Text className="text-background-70 font-generalsans-medium text-sm">
                    Old goal:
                  </Text>
                  <XLHeader>{10}</XLHeader>
                </View>
                <View className="justify-center">
                  <Image
                    source={icons.arrowRight}
                    className="w-6 h-6"
                    resizeMode="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                  />
                </View>
                <View className="items-center">
                  <Text className="text-habitColors-blue-up/70 font-generalsans-medium text-sm">
                    New goal:
                  </Text>
                  <XLHeader className={"text-habitColors-blue-up"}>{12}</XLHeader>
                </View>
              </View>
            </BasicContainer>
            <BasicContainer>
              <View className="mb-2 gap-2">
                <View className="flex-row items-center gap-2">
                  <Image
                    source={icons.shining}
                    className="w-6 h-6"
                    resizeMode="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                  />

                  <XLHeader>Habit</XLHeader>
                </View>
                <View>
                  <Subheader>Reduced your goal</Subheader>
                  <Text className="text-background-70 font-generalsans-medium text-sm">
                    This is a readjustment. Not a setback.
                  </Text>
                </View>
              </View>
              <View className="flex-row w-full justify-evenly">
                <View className="items-center">
                  <Text className="text-background-70 font-generalsans-medium text-sm">
                    Old goal:
                  </Text>
                  <XLHeader>{10}</XLHeader>
                </View>
                <View className="justify-center">
                  <Image
                    source={icons.arrowRight}
                    className="w-6 h-6"
                    resizeMode="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                  />
                </View>
                <View className="items-center">
                  <Text className="text-habitColors-red-up/70 font-generalsans-medium text-sm">
                    New goal:
                  </Text>
                  <XLHeader>
                    <Text className={"text-habitColors-red-up"}>{8}</Text>
                  </XLHeader>
                </View>
              </View>
            </BasicContainer>
          </View>
        </View>
        <View>
          <XLHeader>Built-in Analytics</XLHeader>
          <Subheader>
            No more guessing. See progress over time — for real
          </Subheader>
          <View className="scale-[.8] h-5/6 overflow-hidden -mt-4">
            <CartesianAnalytics
              data={demoChartData}
              xKey="date"
              yKeys={["completionCount"]}
              label="Daily Progress"
            />
          </View>
          <View className="h-8 w-full"></View>
        </View>
      </PagerView>
      <View className="w-full">
        
        
         
            <TextButton
              type="solid"
              text="Get Started"
              
              onPress={() => {router.replace("/auth/signup")}}
            />
       
          
     
      </View>
    </View>
  );
};

export default PageFeatures;
