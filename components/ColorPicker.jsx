import { View } from "react-native";
import React, { memo } from "react";
import ColorSwatch from "./ColorSwatch";
import tailwindConfig from "../tailwind.config";

const colors = tailwindConfig.theme.extend.colors.habitColors;

const ColorPicker = ({ habitColors, setColor, selectedColor }) => {
  return (
    <View className="flex-1 w-full flex-row gap-2 justify-center">
      {Object.keys(colors).map((color) => (
        <View key={color} className="flex flex-1 h-full gap-2">
          {Object.keys(colors[color]).map((shade) => (
            <ColorSwatch
              key={shade}
              color={colors[color][shade]}
              setColor={() => setColor(colors[color][shade])}
              isSelected={selectedColor === colors[color][shade]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default ColorPicker;
