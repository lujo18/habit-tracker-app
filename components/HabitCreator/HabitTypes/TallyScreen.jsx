import { View, Text } from "react-native";
import React, { memo } from "react";
import DropdownMenu from "../../DropdownMenu";

const TallyScreen = memo(
  ({
    habitLabel,
    habitRepeat,
    handleOpen,
    openMenu,
    setLabel,
    setRepeat,
    labelOption,
    repeatOption,
  }) => {
    return (
      <View className="p-5 gap-4">
        <View>
          <Text className="text-highlight-80">
            Count how much you do without a specific goal:
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-xl text-highlight-60">count</Text>
          <DropdownMenu
            value={habitLabel}
            onChange={setLabel}
            options={labelOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 2}
            id={2}
          />
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-xl text-highlight-60">every</Text>
          <DropdownMenu
            value={habitRepeat}
            onChange={setRepeat}
            options={repeatOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 3}
            id={3}
          />
        </View>
      </View>
    );
  }
);

export default TallyScreen;
