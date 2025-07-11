import { View, Text } from "react-native";
import React from "react";
import ColorPicker from "../ColorPicker";

const HabitStyle = ({ selectedColor, setColor }) => {
  return (
    <View className="flex-1">
      <ColorPicker selectedColor={selectedColor} setColor={setColor} />
    </View>
  );
};

export default HabitStyle;
