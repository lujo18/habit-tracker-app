import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import tailwindConfig from "../tailwind.config";
import icons from "../constants/icons";

const tailwindColors = tailwindConfig.theme.extend.colors;


const BackArrow = () => {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Image
        source={icons.arrowRightSLine}
        className="w-9 h-9"
        resizeMode="cover"
        tintColor={tailwindColors["highlight"]["90"]}
        style={{ transform: [{ scaleX: -1 }] }}
      />
    </TouchableOpacity>
  );
};

export default BackArrow;
