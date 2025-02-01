import { View } from "react-native";
import React, { memo } from "react";
import ColorSwatch from "./ColorSwatch";

const ColorPicker = memo(({ habitColors, setColor, selectedColor }) => {
  return (
    <View className="w-full flex-row gap-2 justify-center">
      {Object.keys(habitColors).map((color) => (
        <ColorSwatch
          key={color}
          color={habitColors[color]}
          setColor={setColor}
          isSelected={selectedColor === habitColors[color]}
        />
      ))}
    </View>
  );
});

export default ColorPicker;
