import {
  View,
  Text,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import ColorSwatch from "./ColorSwatch";


import {
  DevRepository,
  getHabitLabels,
  getHabitLocations,
  QuitHabitRepository,
} from "../db/sqliteManager";

import { HabitsRepository, HabitSettingRepository } from "../db/sqliteManager";
import { formatScrollerDate } from "../utils/formatters";
import Header from "./Text/Header";
import XLHeader from "./Text/XLHeader";

import ScrollingPager from "./Paging/ScrollingPager";

import HabitType from "./HabitCreator/HabitType";
import HabitSettings from "./HabitCreator/HabitSettings";
import HabitStyle from "./HabitCreator/HabitStyle";
import HabitDedication from "./HabitCreator/HabitDedication";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const habitRepo = new HabitsRepository();
  const quitHabitRepo = new QuitHabitRepository();
  const habitSettingRepo = new HabitSettingRepository();
  const devRepo = new DevRepository();

  // Paging habit creator
  const [currentPage, setCurrentPage] = useState(0);

  // 1. Habit Type Screen
  const [habitSetting, setHabitSetting] = useState("build");

  // 2. Habit Settings Screen
  const [habitName, setHabitName] = useState("");
  const [habitGoal, setHabitGoal] = useState("");
  const [habitLimit, setHabitLimit] = useState("");
  const [habitLabel, setHabitLabel] = useState("");
  const [habitRepeat, setHabitRepeat] = useState("");
  const [habitLocation, setHabitLocation] = useState("");

  // Automatic Habit Data
  const [startTime, setStartTime] = useState(new Date());
  const [labelOption, setLabelOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  // Dropdown
  const [openMenu, setOpenMenu] = useState(0);

  // 3. Habit Style Screen
  const [selectedColor, setSelectedColor] = useState(
    habitColors[Object.keys(habitColors)[0]]
  );

  // 4. Habit Oath
  const [oathSigned, setOathSigned] = useState(false);

  const pageButtonContraints = useMemo(
    () => [
      {
        pageId: 0,
        backName: "Cancel",
        forwardName: "Next",
        constraints: habitSetting === "",
        backAction: () => onClose(),
        forwardAction: () => shiftCurrentPage(),
      },
      {
        pageId: 1,
        backName: "Back",
        forwardName: "Next",
        constraints:
          habitName.length < 1 ||
          habitGoal === "" ||
          habitLabel === "" ||
          habitRepeat === "" ||
          habitLocation === "",
        backAction: () => shiftCurrentPage(-1),
        forwardAction: () => shiftCurrentPage(),
      },
      {
        pageId: 2,
        backName: "Back",
        forwardName: "Next",
        constraints: selectedColor === "",
        backAction: () => shiftCurrentPage(-1),
        forwardAction: () => shiftCurrentPage(),
      },
      {
        pageId: 3,
        backName: "Back",
        forwardName: "Create",
        constraints: !oathSigned,
        backAction: () => shiftCurrentPage(-1),
        forwardAction: () => createHabit(),
      },
    ],
    [
      habitSetting,
      habitLimit,
      habitLabel,
      habitRepeat,
      habitGoal,
      habitLocation,
      openMenu,
      labelOption,
      locationOption,
    ]
  );

  useEffect(() => {
    setHabitSetting("");
    setHabitName("");
    setHabitGoal("");
    setHabitLimit("");
    setHabitLabel("");
    setHabitRepeat("");
    setHabitLocation("");
    setStartTime(new Date());
    setSelectedColor(habitColors[Object.keys(habitColors)[0]]);
  }, [isVisible]);

  const retrieveOptions = async () => {
    setLabelOption(await habitSettingRepo.getHabitLabels());
    setLocationOption(await habitSettingRepo.getHabitLocations());
  };

  useEffect(() => {
    retrieveOptions();
  }, []);

  const shiftCurrentPage = (direction = 1) => {
    setCurrentPage((prev) => prev + direction);
  };

  const changeHabitGoal = useCallback((value) => {
    setHabitGoal(value);
  }, []);

  const createHabit = async () => {
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
          habitLocation,
        ]);
      } else if (habitSetting == "quit") {
        await quitHabitRepo.createHabit([
          habitName,
          formatScrollerDate(startTime),
          selectedColor,
        ]);
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
    setStartTime(value);
  };

  const handleOpen = (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };

  const addHabitLabel = async (value) => {
    await habitSettingRepo.addHabitLabel(value);
    retrieveOptions();
  };

  const addHabitLocation = async (value) => {
    await habitSettingRepo.addHabitLocation(value);
    retrieveOptions();
  };


  useEffect(() => {
    console.log("TESTING habitName === ''", habitName === "");
    console.log("TESTING habitGoal === ''", habitGoal === "");
    console.log("TESTING habitLabel === ''", habitLabel === "");
    console.log("TESTING habitRepeat === ''", habitRepeat === "");
    console.log("TESTING habitLocation === ''", habitLocation === "");
  }, [habitName, habitGoal, habitLabel, habitRepeat, habitLocation]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onDismiss={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setOpenMenu(0);
        }}
        accessible={false}
      >
        <SafeAreaView
          className="w-full h-[90vh] justify-center bg-background-90 absolute bottom-0 rounded-t-3xl"
          edges={["bottom"]}
        >
          <View className="justify-center items-center">
            <Header className="text-2xl">Create Habit</Header>
          </View>

          <ScrollingPager isControlled={true} currentPage={currentPage}>
            <HabitType
              pageTitle={"Choose Type"}
              habitType={habitSetting}
              setHabitType={setHabitSetting}
            />
            <HabitSettings
              pageTitle={"Set Your Goal"}
              habitType={habitSetting}
              habitName={habitName}
              habitLimit={habitLimit}
              habitLabel={habitLabel}
              habitRepeat={habitRepeat}
              habitGoal={habitGoal}
              habitLocation={habitLocation}
              onGoalChange={changeHabitGoal}
              openMenu={openMenu}
              handleOpen={handleOpen}
              setName={changeHabitName}
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
              // Quit data
              startTime={startTime}
              setStartTime={setQuitStart}
                
            />
            <HabitStyle pageTitle={"Make It Yours"} />
            <HabitDedication pageTitle={"Lock It In"} />
          </ScrollingPager>

          {/*
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
          */}

          <View className="flex-row gap-4 mb-3 p-4">
            <TextButton
              text={pageButtonContraints[currentPage].backName}
              type={"outline"}
              onPress={pageButtonContraints[currentPage].backAction}
              containerStyles="flex-1 bg-background-80"
            />
            <TextButton
              text={pageButtonContraints[currentPage].forwardName}
              type={"solid"}
              onPress={pageButtonContraints[currentPage].forwardAction}
              containerStyles={`flex-1`}
              //specialStyles={{ backgroundColor: selectedColor }}
              disabled={pageButtonContraints[currentPage].constraints}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default memo(HabitCreator);
