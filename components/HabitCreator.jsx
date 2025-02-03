import {
  View,
  Text,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import React, {memo, useCallback, useState } from "react";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import ColorSwatch from "./ColorSwatch";
import { useSQLiteContext } from "expo-sqlite";

import BuildScreen from "./BuildScreen";
import QuitScreen from "./QuitScreen";
import TallyScreen from "./TallyScreen";
import ColorPicker from "./ColorPicker";

const habitColors = tailwindConfig.theme.extend.colors["habitColors"];

const goalOption = [
  {
    name: "at least",
    desc: "Try to reach this amount",
    icon: icons.habitAtLeast,
  },
  {
    name: "at most",
    desc: "Avoid going over set amount",
    icon: icons.habitAtMost,
  },
];

const repeatOption = [
  {
    name: "day",
    desc: "Resets everyday",
    icon: icons.habitDaily,
  },
  {
    name: "week",
    desc: "Resets every week",
    icon: icons.habitWeekly,
  },
  {
    name: "month",
    desc: "Resets every month",
    icon: icons.habitMonthly,
  },
  {
    name: "year",
    desc: "Resets every year",
    icon: icons.habitYearly,
  },
];

const labelOption = [
  {
    name: "minutes",
  },
  {
    name: "hours",
  },
  {
    name: "pages",
  },
];
  
const HabitCreator = ({ isVisible, onClose }) => {
  const [habitName, setHabitName] = useState("");
  const [habitSetting, setHabitSetting] = useState("build");
  const [selectedColor, setSelectedColor] = useState(
    habitColors[Object.keys(habitColors)[0]]
  );
  const [habitGoal, setHabitGoal] = useState("");
  const [habitLimit, setHabitLimit] = useState("");
  const [habitLabel, setHabitLabel] = useState("");
  const [habitRepeat, setHabitRepeat] = useState("");
  const [openMenu, setOpenMenu] = useState(0);

  const db = useSQLiteContext();


  const changeHabitGoal = useCallback((value) => {
    setHabitGoal(value);
  }, []);

  const createHabit = async () => {
    console.log("create habit");

    if (!habitName) {
      Alert.alert("Error", "Name is required!");
      return;
    }

    try {
      const results = await db.runAsync(
        `INSERT INTO Habits (name, setting, repeat, label, limitType, current, goal, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          habitName,
          habitSetting,
          habitRepeat,
          habitLabel,
          habitLimit,
          0,
          habitGoal,
          selectedColor,
        ]
      );
      console.log("results", results);
      console.log("Success", "Habit inserted successfully!");
    } catch (error) {
      console.log("Insert error", error);
    }

    onClose();

    setHabitName("");
    setHabitSetting("build");
    setHabitGoal("");
    setHabitLimit("");
    setHabitLabel("");
    setHabitRepeat("");
  };

  const handlePress = (newState) => {
    setHabitSetting(newState);
  };

  const changeHabitName = (value) => {
    setHabitName(value);
  };

  const setColor = (color) => {
    setSelectedColor(color);
  };

  const setType = (value) => {
    setHabitLimit(value);
    setOpenMenu(0);
  };

  const setLabel = (value) => {
    setHabitLabel(value);
    setOpenMenu(0);
  };

  const setRepeat = (value) => {
    setHabitRepeat(value);
    setOpenMenu(0);
  };

  const handleOpen = (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };


  const RenderHabitSettingPage = useCallback(() => {
    console.log("reload");
    switch (habitSetting) {
      case "build":
        return (
          <BuildScreen
            habitLimit={habitLimit}
            habitLabel={habitLabel}
            habitRepeat={habitRepeat}
            habitGoal={habitGoal}
            onGoalChange={changeHabitGoal}
            openMenu={openMenu}
            handleOpen={handleOpen}
            setType={setType}
            setLabel={setLabel}
            setRepeat={setRepeat}
            goalOption={goalOption}
            repeatOption={repeatOption}
            labelOption={labelOption}
          />
        );
      case "quit":
        return <QuitScreen />;
      case "tally":
        return (
          <TallyScreen
            habitLabel={habitLabel}
            habitRepeat={habitRepeat}
            openMenu={openMenu}
            handleOpen={handleOpen}
            setLabel={setLabel}
            setRepeat={setRepeat}
            labelOption={labelOption}
            repeatOption={repeatOption}
          />
        );
      default:
        return <Text>Select an option</Text>;
    }
  }, [habitSetting, habitLimit, habitLabel, habitRepeat, openMenu]);  


  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="w-full h-[90vh] justify-center p-7 bg-background-90 absolute bottom-0 rounded-t-3xl">
        <View className="justify-center items-center">
          <Text className="text-highlight text-2xl">Create Habit</Text>
        </View>

        <ScrollView>
          <View className="flex-1 h-[100vh] justify-start">
            <View className="my-6">
              <BuildInput
                value={habitName}
                handleChange={changeHabitName}
                placeholder="Your new habit"
                inputStyles="text-lg"
              />
            </View>
            <View className="gap-2 flex-1">
              <Text className="text-md text-highlight-60 mb-2 border-b border-background-80">
                Habit Type
              </Text>
              <View className="flex-row gap-4">
                <TextButton
                  text="Build"
                  containerStyles={`${
                    habitSetting === "build"
                      ? "bg-habitColors-hBlue"
                      : "bg-background-90 border-2 border-habitColors-hBlue"
                  } flex-1`}
                  onPress={() => handlePress("build")}
                />
                <TextButton
                  text="Quit"
                  containerStyles={`${
                    habitSetting === "quit"
                      ? "bg-habitColors-hRed"
                      : "bg-background-90 border-2 border-habitColors-hRed"
                  } flex-1`}
                  onPress={() => handlePress("quit")}
                />
                <TextButton
                  text="Tally"
                  containerStyles={`${
                    habitSetting === "tally"
                      ? "bg-background-70"
                      : "bg-background-90 border-2 border-background-70"
                  } flex-1`}
                  onPress={() => handlePress("tally")}
                />
              </View>
                  
              <RenderHabitSettingPage />
              
            </View>
            <Text className="text-md text-highlight-60 mb-2 border-b border-background-80">
              Habit Style
            </Text>
            <View className="flex-1">

              <ColorPicker
                habitColors={habitColors}
                setColor={setColor}
                selectedColor={selectedColor}
              />

            </View>
          </View>
        </ScrollView>

        <View className="flex-row gap-4 mb-3">
          <TextButton
            text="Cancel"
            onPress={onClose}
            containerStyles="flex-1 bg-background-80"
          />
          <TextButton
            text="Create"
            onPress={createHabit}
            containerStyles={`flex-1`}
            specialStyles={{ backgroundColor: selectedColor }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default memo(HabitCreator);
