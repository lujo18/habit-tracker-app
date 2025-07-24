import {
  View,
  Text,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import ColorSwatch from "./ColorSwatch";

import * as Haptics from "expo-haptics";
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

  const [habitMaxGoal, setHabitMaxGoal] = useState("");

  // Automatic Habit Data
  const [startTime, setStartTime] = useState(new Date());
  const [labelOption, setLabelOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  // Dropdown
  const [openMenu, setOpenMenu] = useState(0);

  // 3. Habit Style Screen
  const [selectedColor, setSelectedColor] = useState("");
  /*habitColors[Object.keys(habitColors)[0]]*/

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
          (habitSetting === "dynamic" && habitMaxGoal === "") ||
          ((habitSetting === "dynamic" || habitSetting === "build") &&
            habitGoal === "") ||
          ((habitSetting === "dynamic" ||
            habitSetting === "build" ||
            habitSetting === "tally") &&
            (habitLabel === "" || habitRepeat === "" || habitLocation === "")),
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
      habitName,
      habitLimit,
      habitLabel,
      habitRepeat,
      habitGoal,
      habitLocation,
      selectedColor,
      oathSigned,
      openMenu,
      labelOption,
      locationOption,
    ]
  );

  useEffect(() => {
    if (!isVisible) {
      setHabitSetting("");
      setCurrentPage(0);
    }
    setHabitName("");
    setHabitGoal("");
    setHabitLimit("");
    setHabitLabel("");
    setHabitRepeat("");
    setHabitLocation("");
    setStartTime(new Date());
    setSelectedColor("");
  }, [isVisible, habitSetting]);

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

  const changeHabitGoal = (value) => {
    setHabitGoal(value);
  };

  const createHabit = async () => {
    if (!habitName) {
      Alert.alert("Error", "Name is required!");
      return;
    }

    try {
      if (habitSetting === "build" || habitSetting === "dynamic") {
        await habitRepo.createHabit([
          habitName,
          habitSetting,
          habitRepeat,
          habitLabel,
          "atleast",
          habitGoal,
          habitMaxGoal,
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

  const setMaxGoal = (value) => {
    console.log("DYNM", value);
    setHabitMaxGoal(value);
    //changeHabitGoal(Math.max(Math.round(value * .10), 1))
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

  const setOath = (value) => {
    setOathSigned(value);
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

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onDismiss={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="w-full h-full relative bg-background justify-end pt-2">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full h-full justify-center rounded-t-3xl"
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setOpenMenu(0);
            }}
            accessible={false}
            className="flex-1 w-full"
          >
            <View className="flex-1">
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
                  habitMaxGaol={habitMaxGoal}
                  onGoalChange={changeHabitGoal}
                  openMenu={openMenu}
                  handleOpen={handleOpen}
                  setName={changeHabitName}
                  setType={setType}
                  setLabel={setLabel}
                  setRepeat={setRepeat}
                  setLocation={setLocation}
                  setMaxGoal={setMaxGoal}
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
                <HabitStyle
                  pageTitle={"Make It Yours"}
                  selectedColor={selectedColor}
                  setColor={setColor}
                />
                <HabitDedication
                  pageTitle={"Lock It In"}
                  setOathSigned={setOath}
                />
              </ScrollingPager>
              <View className="flex-row gap-4 p-4">
                <TextButton
                  text={pageButtonContraints[currentPage].backName}
                  type={"outline"}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    pageButtonContraints[currentPage].backAction();
                  }}
                  containerStyles="flex-1 bg-background-80"
                />
                <TextButton
                  text={pageButtonContraints[currentPage].forwardName}
                  type={"solid"}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    pageButtonContraints[currentPage].forwardAction();
                  }}
                  containerStyles={`flex-1`}
                  disabled={pageButtonContraints[currentPage].constraints}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default memo(HabitCreator);
