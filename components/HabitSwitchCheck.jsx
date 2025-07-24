import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from "react-native";
import React from "react";
import Header from "./Text/Header";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import Subheader from "./Text/Subheader";



const tailwindColors = tailwindConfig.theme.extend.colors;

const HabitSwitchCheck = ({ value = false, data, onToggle }) => {

  
  const style = value
    ? ""
    : "border-background-80";

  const activeBgColor = value ? { borderColor: data.color } : {};

  return (
    <Animated.View
      layout={LinearTransition.springify(3000)
        .damping(15)
        .mass(1)
        .stiffness(500)
        .overshootClamping(false)
        .restDisplacementThreshold(1)
        .restSpeedThreshold(1)}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
      }}
    >
      <TouchableOpacity
        className={`p-4 px-6 border-2  gap-2 rounded-xl ${style}`}
        onPress={onToggle}
        style={activeBgColor}
      >
        <View className="flex-row gap-4 items-center">
          <Text className="text-white font-generalsans-medium text-lg">
            {data.name}
          </Text>
          {value && ((data.setting === "build") ? (
            <Image
              source={icons.addBox}
              className="w-8 h-8"
              resizeMode="cover"
              tintColor={data.color}
            />
          ) : (
            <Image
              source={icons.resetArrow}
              className="w-8 h-8"
              resizeMode="cover"
              tintColor={data.color}
            />
          ))}
        </View>
        {value && (
          <View className="flex-row gap-2">
            <Subheader>{data.referenceGoal} {data.label} a {data.repeat}</Subheader>
     
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default HabitSwitchCheck;
