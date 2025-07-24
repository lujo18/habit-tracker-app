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

const SwitchCheck = ({ value, label, onToggle }) => {
  const style = value
    ? "bg-habitColors-blue-up/30 border-habitColors-blue-up"
    : "border-background-80";

  return (
    <Animated.View
      layout={LinearTransition.springify(3000)
        .damping(15)
        .mass(1)
        .stiffness(500)
        .overshootClamping(false)
        .restDisplacementThreshold(1)
        .restSpeedThreshold(1)}

      
    >
      <TouchableOpacity
        className={`p-4 px-6 border-2 flex-row justify-center  items-center gap-4 rounded-full ${style}`}
        onPress={onToggle}
      >
        <Text className="text-white font-generalsans-medium text-lg">
          {label}
        </Text>
        {value && (
          <Image
            source={icons.check}
            className="w-8 h-8"
            resizeMode="cover"
            tintColor={tailwindColors["habitColors"]["blue"]["up"]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SwitchCheck;
