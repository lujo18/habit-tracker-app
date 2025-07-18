import { View, Text } from "react-native";
import React, { memo, useCallback, useState } from "react";
import DropdownMenu from "../../DropdownMenu";
import BuildInput from "../../BuildInput";
import { HabitSettingRepository } from "../../../db/sqliteManager";
import Subheader from "../../Text/Subheader";
import GoalInput from "../../Inputs/GoalInput";

const BuildScreen = memo(
  ({
    habitLimit,
    habitLabel,
    habitRepeat,
    habitGoal,
    habitLocation,
    onGoalChange,
    handleOpen,
    openMenu,
    setType,
    setLabel,
    setRepeat,
    setLocation,
    goalOption,
    labelOption,
    repeatOption,
    locationOption,
    addHabitLabel,
    addHabitLocation
  }) => {
    const habitSettingRepo = new HabitSettingRepository();

    return (
      <View className="p-5 gap-4">
        <View>
          <Text className="text-highlight-80">
            Establish a goal of building your habit with the following rules:
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Subheader className="text-xl text-highlight-60">I will do</Subheader>
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

export default BuildScreen;
