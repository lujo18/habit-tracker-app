import {
  View,
  Text,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, {memo, useCallback, useEffect, useState } from "react";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import ColorSwatch from "./ColorSwatch";

import BuildScreen from "./BuildScreen";
import QuitScreen from "./QuitScreen";
import TallyScreen from "./TallyScreen";
import ColorPicker from "./ColorPicker";
import { DevRepository, getHabitLabels, getHabitLocations,  } from "../db/sqliteManager";

import { HabitsRepository, HabitSettingRepository } from "../db/sqliteManager";

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


  
const HabitCreator = ({ isVisible, onClose }) => {
  // Database repo connection
  const habitRepo = new HabitsRepository()
  const habitSettingRepo = new HabitSettingRepository()
  const devRepo = new DevRepository()


  const [habitName, setHabitName] = useState("");
  const [habitSetting, setHabitSetting] = useState("build");
  const [selectedColor, setSelectedColor] = useState(
    habitColors[Object.keys(habitColors)[0]]
  );
  const [habitGoal, setHabitGoal] = useState("");
  const [habitLimit, setHabitLimit] = useState("");
  const [habitLabel, setHabitLabel] = useState("");
  const [habitRepeat, setHabitRepeat] = useState("");
  const [habitLocation, setHabitLocation] = useState("");
  const [openMenu, setOpenMenu] = useState(0);

  const [startTime, setStartTime] = useState(new Date());


  const [labelOption, setLabelOption] = useState([])
  const [locationOption, setLocationOption] = useState([])

  const retrieveOptions = async () => {
    setLabelOption(await habitSettingRepo.getHabitLabels());
    setLocationOption(await habitSettingRepo.getHabitLocations());

    
  }

  useEffect(() => {
    retrieveOptions()
  }, [])

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
      if (habitSetting == "build") {
        await habitRepo.createHabit([
          habitName,
          habitSetting,
          habitRepeat,
          habitLabel,
          "atleast",
          habitGoal,
          selectedColor,
          habitLocation
        ])
      }
      else if (habitSetting == "quit") {
        await habitRepo.createQuitHabit([
          habitName,
          new Date(startTime).toISOString().replace('T', ' ').split('.')[0], // Convert to "YYYY-MM-DD HH:MM:SS",
          selectedColor,
        ])
      }
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

  const setLocation = (value) => {
    setHabitLocation(value);
    setOpenMenu(0);
  };

  const setQuitStart = (value) => {
    setStartTime(value)
  }

  const handleOpen = (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };

  const addHabitLabel = async (value) => {
    await habitSettingRepo.addHabitLabel(value)
    retrieveOptions()
  }

  const addHabitLocation = async (value) => {
    await habitSettingRepo.addHabitLocation(value)
    retrieveOptions()
  }


  const RenderHabitSettingPage = useCallback(() => {
    //console.log("reload");
    switch (habitSetting) {
      case "build":
        return (
          <BuildScreen
            habitLimit={habitLimit}
            habitLabel={habitLabel}
            habitRepeat={habitRepeat}
            habitGoal={habitGoal}
            habitLocation={habitLocation}
            onGoalChange={changeHabitGoal}
            openMenu={openMenu}
            handleOpen={handleOpen}
            setType={setType}
            setLabel={setLabel}
            setRepeat={setRepeat}
            setLocation={setLocation}
            goalOption={goalOption}
            repeatOption={repeatOption}
            labelOption={labelOption}
            locationOption={locationOption}
            addHabitLabel={addHabitLabel}
            addHabitLocation={addHabitLocation}
          />
        );
      case "quit":
        return (
          <QuitScreen 
            startTime={startTime}
            setStartTime={setQuitStart}
          />
        )
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
  }, [habitSetting, habitLimit, habitLabel, habitRepeat, openMenu, labelOption, locationOption]);  


  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onDismiss={onClose}>
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); setOpenMenu(0);}} accessible={false}>
        <View className="w-full h-[90vh] justify-center p-7 bg-background-90 absolute bottom-0 rounded-t-3xl">
          <View className="justify-center items-center">
            <Text className="text-highlight text-2xl">Create Habit</Text>
          </View>
         
            <View className="flex-1 h-[100vh] justify-start">
              <View className="my-6">
                <BuildInput
                  value={habitName}
                  handleChange={changeHabitName}
                  placeholder="Your new habit"
                  inputStyles="text-lg"
                />
              </View>
              <View className="gap-2">
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
                  
              </View>
              <View>
                <RenderHabitSettingPage />
              </View>
              <Text className="text-md text-highlight-60 mb-2 border-b border-background-80">
                Color Theme
              </Text>
              <View className="">

                <ColorPicker
                  habitColors={habitColors}
                  setColor={setColor}
                  selectedColor={selectedColor}
                />

              </View>
            </View>
         

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
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default memo(HabitCreator);
