import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, {
  memo,
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useState,
  createContext,
  useRef,
} from "react";
import icons from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Habit from "../../components/Habit";
import tailwindConfig from "../../tailwind.config";
import HabitCreator from "../../components/HabitCreator";
import {
  DevRepository,
  HabitHistoryRepository,
  HabitsRepository,
} from "../../db/sqliteManager";
import DateSelector from "../../components/DateSelector";
import { useLoading } from "../../components/LoadingProvider";
//import { Image } from 'expo-image'
import { DateContext, useDateContext } from "../../contexts/DateContext";
import QuitHabit from "../../components/QuitHabit";
import TimerResetModal from "../../components/TimerResetModal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  measure,
} from "react-native-reanimated";
import { Link, useFocusEffect } from "expo-router";
import { ScrollView } from "react-native";
import { useHabitUpdate } from "../../contexts/HabitUpdateContext";
import HabitGroup from "../../components/HabitGroup";

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

  const { lastUpdateTimestamp } = useHabitUpdate();

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
      showLoading()
      try {
        const result = await historyRepo.getAllHistory(1);
        setHistory(result);
      } finally {
        setTimeout(() => hideLoading(), 150)
      }
      
    };
    fetchHistory();
  }, [selectedDate]);

  const onModalClose = async () => {
    setShowCreateHabit(false);
    loadHabits()
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

  

  return (
    <>
      {/*<DateContext.Provider value={date}>*/}

      <SafeAreaView
        className="bg-background h-full w-full flex-1"
        edges={["top"]}
      >
        <View className="flex-row align-center  p-4">
          <View>
            <Text>Other Option</Text>
          </View>
          <View className="flex-1">
            <Text>Today's Progress</Text>
          </View>
          <TouchableOpacity
            className={`bg-background-80 p-4 rounded-full ${
              showCreateHabit ? "opacity-0" : ""
            }`}
            onPress={() => onAddHabit()}
          >
            <Image
              source={icons.addBox}
              className="w-9 h-9"
              contentFit="cover"
              tintColor={tailwindColors["highlight"]["90"]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 bg-red-50"
            onPress={() => {
              devRepo.DropTables();
            }}
          >
            <Text>Drop Table</Text>
          </TouchableOpacity>

          <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
        </View>

        <View>
          <DateSelector start={oneYearAgo} end={oneYearAhead} />
        </View>

        
          <FlatList
            data={habitGroupsInfo}
            keyExtractor={(item) => item.type}
            renderItem={({ item: group }) => <HabitGroup group={group} habits={habits} onTimerResetOpen={onTimerResetOpen} />}
            className="px-4"
          />

        <TimerResetModal
          data={resetTimerModal}
          onClose={onTimerResetClose}
          showLoading={showLoading}
          hideLoading={hideLoading}
        />
      </SafeAreaView>

      {/*</DateContext.Provider>*/}
    </>
  );
};

export default memo(Home);
