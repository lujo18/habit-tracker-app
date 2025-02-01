import { View, Text } from "react-native";
import React, { memo, useCallback, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import BuildInput from "./BuildInput";

const GoalInput = memo(({ onGoalChange, habitGoal }) => {
  const [localGoal, setLocalGoal] = useState(habitGoal);

  const handleChange = useCallback(
    (value) => {
      setLocalGoal(value);
      onGoalChange(value);
    },
    [onGoalChange]
  );

  return (
    <BuildInput
      value={localGoal}
      handleChange={handleChange}
      placeholder="#"
      keyboardType="numeric"
      inputStyles={"w-[100px] rounded-2xl text-3xl text-center"}
    />
  );
});

const BuildScreen = memo(
  ({
    habitLimit,
    habitLabel,
    habitRepeat,
    habitGoal,
    onGoalChange,
    handleOpen,
    openMenu,
    setType,
    setLabel,
    setRepeat,
    goalOption,
    labelOption,
    repeatOption,
  }) => {
    return (
      <View className="p-5 gap-4">
        <View>
          <Text className="text-highlight-80">
            Establish a goal of building your habit with the following rules:
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-xl text-highlight-60">do</Text>
          <DropdownMenu
            value={habitLimit}
            onChange={setType}
            options={goalOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 1}
            id={1}
          />
        </View>
        <View className="flex-row items-center gap-4">
          <GoalInput onGoalChange={onGoalChange} habitGoal={habitGoal}/>
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

export default BuildScreen;
