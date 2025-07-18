import { View, Text } from "react-native";
import React, { memo, useCallback, useState } from "react";
import DropdownMenu from "../../DropdownMenu";
import BuildInput from "../../BuildInput";
import { HabitSettingRepository } from "../../../db/sqliteManager";
import Subheader from "../../Text/Subheader";
import GoalInput from "../../Inputs/GoalInput";

const DynamicScreen = memo(
  ({
    habitLimit,
    habitLabel,
    habitRepeat,
    habitGoal,
    habitLocation,
    habitMaxGoal,
    onGoalChange,
    handleOpen,
    openMenu,
    setType,
    setLabel,
    setRepeat,
    setLocation,
    setMaxGoal,
    goalOption,
    labelOption,
    repeatOption,
    locationOption,
    addHabitLabel,
    addHabitLocation
  }) => {
    const habitSettingRepo = new HabitSettingRepository();

    return (
      <View className="p-5 gap-4 pb-40">
        <View>
          <Text className="text-highlight-80">
            Establish a goal of building your habit with the following rules:
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <View className="flex items-center gap-4">
            <Subheader className="text-xl text-highlight-60">I will start at</Subheader>
            <GoalInput onGoalChange={onGoalChange} habitGoal={habitGoal}/>
          </View>
          <Subheader>AND</Subheader>
          <View className="flex items-center gap-4">
            <Subheader className="text-xl text-highlight-60">Max out at</Subheader>
            <GoalInput onGoalChange={setMaxGoal} habitGoal={habitMaxGoal}/>
          </View>
        </View>
        <View className="flex-row">
          <DropdownMenu
            value={habitLabel}
            onChange={setLabel}
            options={labelOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 2}
            id={2}
            isCustom={true}
            handleCreateNew={addHabitLabel}
          />
        </View>
        <View className="flex-row items-center gap-4">
          <Subheader className="text-xl text-highlight-60">every</Subheader>
          <DropdownMenu
            value={habitRepeat}
            onChange={setRepeat}
            options={repeatOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 3}
            id={3}
            
          />
        </View>
        <View className="flex-row items-center gap-4">
          <Subheader className="text-xl text-highlight-60">at</Subheader>
          <DropdownMenu
            value={habitLocation}
            onChange={setLocation}
            options={locationOption}
            handleOpen={handleOpen}
            isOpen={openMenu === 1}
            id={1}
            isCustom={true}
            handleCreateNew={addHabitLocation}
          />
        </View>
      </View>
    );
  }
);

export default DynamicScreen;
