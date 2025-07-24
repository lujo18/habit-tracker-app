import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { memo, useMemo, useCallback, useEffect, useState } from "react";
import icons from "../../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Habit from "../../../components/Habit";
import tailwindConfig from "../../../tailwind.config";
import HabitCreator from "../../../components/HabitCreator";
import {
  DevRepository,
  HabitHistoryRepository,
  HabitsRepository,
} from "../../../db/sqliteManager";
import DateSelector from "../../../components/DateSelector";
import { useLoading } from "../../../components/LoadingProvider";
//import { Image } from 'expo-image'
import { useDateContext } from "../../../contexts/DateContext";
import QuitHabit from "../../../components/QuitHabit";
import TimerResetModal from "../../../components/TimerResetModal";
import { useFocusEffect } from "expo-router";
import { useHabitUpdate } from "../../../contexts/HabitUpdateContext";
import HabitGroup from "../../../components/HabitGroup";
import Header from "../../../components/Text/Header";
import Subheader from "../../../components/Text/Subheader";
import { useHabitBrief } from "../../../contexts/HabitBriefContext";
import HabitBrief from "../../../components/HabitBrief";
import Icon from "../../../components/Icon";
import Animated, {
  LinearTransition,
  Easing,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import RadialGlow from "../../../components/RadialGlow";

const tailwindColors = tailwindConfig.theme.extend.colors;

const habitGroups = [
  {
    label: "Daily",
    type: "day",
    icon: icons.habitDaily,
    visible: true,
  },
  {
    label: "Weekly",
    type: "week",
    icon: icons.habitWeekly,
    visible: true,
  },
  {
    label: "Monthly",
    type: "month",
    icon: icons.habitMonthly,
    visible: true,
  },
  {
    label: "Yearly",
    type: "year",
    icon: icons.habitYearly,
    visible: true,
  },
  {
    label: "Quit",
    type: "forever",
    icon: icons.habitYearly,
    visible: true,
  },
];

const Home = () => {
  const habitsRepo = useMemo(() => new HabitsRepository(), []);
  const historyRepo = useMemo(() => new HabitHistoryRepository(), []); // DELETE THIS
  const devRepo = useMemo(() => new DevRepository(), []); //DELETE THIS

  const { lastUpdateTimestamp, triggerUpdate } = useHabitUpdate();
  const { habitBriefContent } = useHabitBrief();
  const [habitBriefOpen, setHabitBriefOpen] = useState(true);

  const [history, setHistory] = useState();

  const yearToMs = 365 * 24 * 60 * 60 * 1000;
  const oneYearAgo = new Date("2024-12-01" /*Date.now() - yearToMs*/);
  const oneYearAhead = new Date();
  oneYearAhead.setHours(0, 0, 0, 0);

  const { showLoading, hideLoading, isLoading } = useLoading();
  const { selectedDate, seteSelectedDate } = useDateContext();

  const [habitGroupsInfo, setHabitGroupsInfo] = useState(habitGroups);

  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [habits, setHabits] = useState([]);
  const [quitHabits, setQuitHabits] = useState([]);

  // Timer Reset Modal for time based habits
  const [resetTimerModal, setResetTimerModal] = useState({});

  const loadHabits = useCallback(async () => {
    try {
      console.log("Loading habits...");
      const fetchedHabits = await habitsRepo.getAll();
      setHabits(fetchedHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  }, [habitsRepo]);

  // Reload when lastUpdateTimestamp changes
  useEffect(() => {
    loadHabits();
  }, [loadHabits, lastUpdateTimestamp]);

  // Also reload when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (habits.length > 0) {
        loadHabits();
      }
    }, [loadHabits])
  );

  useEffect(() => {
    const fetchHistory = async () => {
      showLoading();
      try {
        const result = await historyRepo.getAllHistory(1);
        setHistory(result);
      } finally {
        setTimeout(() => hideLoading(), 150);
      }
    };
    fetchHistory();
  }, [selectedDate]);

  const onModalClose = async () => {
    setShowCreateHabit(false);
    loadHabits();
  };

  const onAddHabit = () => {
    setShowCreateHabit(true);
  };

  const onTimerResetClose = () => {
    setResetTimerModal({});
  };

  const onTimerResetOpen = (data) => {
    setResetTimerModal(data);
  };

  const closeHabitBrief = () => {
    setHabitBriefOpen(false);
  };

  return (
    <>
      {/*<DateContext.Provider value={date}>*/}

      <SafeAreaView
        className="bg-background h-full w-full flex-1"
        edges={["top"]}
      >
      
        <View className="flex-row justify-between p-4">
          <View className="flex-1"></View>
          <View className="flex-1 items-center">
            <Header>NoRedo</Header>
          </View>
          <View className="flex-1"></View>
          {/* <TouchableOpacity
            className="w-10 h-10 bg-red-50"
            onPress={() => {
              devRepo.DropTables();
            }}
          >
            <Text>Drop Table</Text>
          </TouchableOpacity> */}

          <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
        </View>

        <View>
          <DateSelector start={oneYearAgo} end={oneYearAhead} />
        </View>

        {habits.length === 0 && quitHabits.length === 0 ? (
          <View className="flex items-center justify-center h-1/2 gap-4">
            <Header>Your legacy is about to begin.</Header>
            <View className="flex items-center">
              <Subheader>Click the plus in the top right corner</Subheader>
              <Subheader>to create your first habit.</Subheader>
            </View>
          </View>
        ) : (
          <FlatList
            data={habitGroupsInfo}
            keyExtractor={(item) => item.type}
            renderItem={({ item: group }) => (
              <HabitGroup
                group={group}
                habits={habits}
                onTimerResetOpen={onTimerResetOpen}
              />
            )}
            className="px-4"
          />
        )}

        <Animated.View
          className="absolute w-full items-center bottom-32 "
          entering={FadeInDown.delay(300).duration(300).easing(Easing.cubic)}
          exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
        >
          <TouchableOpacity
            className={`bg-background-90 p-6 rounded-full shadow-md shadow-black/70 ${
              showCreateHabit ? "opacity-0" : ""
            }`}
            onPress={() => onAddHabit()}
          >
            <Icon name={"addBox"} />
          </TouchableOpacity>
        </Animated.View>

        <TimerResetModal
          data={resetTimerModal}
          onClose={onTimerResetClose}
          showLoading={showLoading}
          hideLoading={hideLoading}
        />

        {/* Slide-up Modal for Habit Brief */}

        <HabitBrief
          habitBriefOpen={habitBriefOpen}
          closeHabitBrief={closeHabitBrief}
        />
      </SafeAreaView>
    </>
  );
};

export default memo(Home);
