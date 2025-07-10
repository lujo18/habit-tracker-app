import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import icons from "../constants/icons";

import { Canvas, Rect, SweepGradient, vec } from "@shopify/react-native-skia";
import Animated, {
  interpolate,
  useSharedValue,
  withReanimatedTimer,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";
import tailwindConfig from "../tailwind.config";
import { HabitHistoryRepository } from "../db/sqliteManager";
import { DateContext, useDateContext } from "../contexts/DateContext";
import { useLoading } from "./LoadingProvider";
import { formatRepeatText } from "../utils/formatters";
import HabitBase from "./HabitBase";
import * as Haptics from 'expo-haptics'

const Habit = memo(({ data, canSubtract, updateSelectedAmount = null, providedSelectedDate }) => {
  const historyRepo = new HabitHistoryRepository();
  const { isLoading } = useLoading();
  const { selectedDate : selectedDateContext } = useDateContext();

  const selectedDate = providedSelectedDate || selectedDateContext
  

  const {
    id,
    name,
    completion,
    setting,
    repeat,
    type,
    label,
    color,
    referenceGoal,
    location,
    date,
    completed,
  } = useMemo(() => data, [data]);

  const [amount, setAmount] = useState(0);
  const [periodAmount, setPeriodAmount] = useState(0);
  const [goal, setGoal] = useState(0);
  const curAmount = useRef(null);
  const [isCompleted, setIsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dynamicData, setDynamicData] = useState(null);

  const borderColor = color;
  const backgroundColor =
    tailwindConfig.theme.extend.colors["background"]["90"];
  const tailwindColors = tailwindConfig.theme.extend.colors;

  const fetchHabitData = useCallback(async () => {
    try {
    const data = await historyRepo.getEntry(id, selectedDate);
    setDynamicData(data);

    if (data == null) {
      const periodData =
        (await historyRepo.getPeriodData(id, selectedDate)) ?? null;
      const previousStreak = await historyRepo.getStrictPreviousPeriodStreak(
        id,
        selectedDate
      );
      //console.log("No history, waiting for action");
      //console.log("Period Data: ", JSON.stringify(periodData))

      setAmount(0);
      if (periodData) {
        //console.log("Period data exists");

        setPeriodAmount(periodData.periodCompletion);
        setGoal(periodData.goal);
        setIsCompleted(periodData.completed == 1);
        setCurrentStreak(
          periodData.streak == 0 && previousStreak > 0
            ? previousStreak
            : periodData.streak
        ); // was periodData.streak == 0 ? periodData.streak : previousStreak but that caused weekly dates that didn't have log save to show 0 for streak instead of correct
      } else {
        //console.log("Period data doesn't exist");
        setPeriodAmount(0);
        setGoal(referenceGoal);
        setIsCompleted(false);
        setCurrentStreak(previousStreak);
      }
    } else {
      //console.log("Existing data:", data);

      setAmount(data.completionCount);
      setPeriodAmount(data.periodCompletion);
      setGoal(data.goal);

      if (data.periodStreak == 0) {
        const previousStreak = await historyRepo.getStrictPreviousPeriodStreak(
          id,
          selectedDate
        );
        setCurrentStreak(
          previousStreak > 0 ? previousStreak : data.periodStreak
        );
      } else {
        setCurrentStreak(data.periodStreak);
      }

      setIsCompleted(data.completed);
    }
    //setAmount(await historyRepo.getCompletion(id, selectedDate)) // try to get completion
    updateSelectedAmount?.(periodAmount);
    curAmount.current = periodAmount;
} catch (error) {
    console.error("Error fetching habit data:", error)
}
  }, [id, selectedDate, isLoading, historyRepo, referenceGoal, updateSelectedAmount]);

  async function updateHabitCompletion(amount, historyData) {
    const periodKey = historyData
      ? historyData.periodKey
      : dynamicData.periodKey;

    //console.log("History data:", historyData)

    updateSelectedAmount && updateSelectedAmount(amount);
    curAmount.current = periodAmount;
    //progressValue.set(amount)
    //console.log("UPDATE: ", id, amount, selectedDate, goal, repeat)
    try {
      await historyRepo.setCompletion(
        id,
        amount,
        selectedDate,
        goal,
        periodKey,
        currentStreak
      );
    } catch (err) {
      console.error("Failed to add:", err);
    }
    //console.log("Cur", currentStreak, "Dyn", streak)

    /*if (currentStreak != streak) {
            try {
            console.log("Set streak", currentStreak)
                
                if (dynamicData) {dynamicData.streak = currentStreak} // removed as per instruction
                await historyRepo.setPeriod("streak", currentStreak, id, periodKey)
            } catch (err) {
                console.error("Failed to set period streak:", err)
            }
        }*/
  }

  useEffect(() => {
    if (!isLoading) {
        fetchHabitData()
    }
  }, [isLoading, selectedDate])

  useEffect(() => {
    const setStreaks = async () => {
      //if (currentStreak == data.streak) {
      try {
        if (!isCompleted && periodAmount >= goal) {
          //console.log("Add streak, should run:", currentStreak + 1);
          setIsCompleted(true);
          setCurrentStreak(currentStreak + 1);
          //await historyRepo.setPeriod("streak", currentStreak + 1, id, data.periodKey)
          //await historyRepo.setPeriod("completed", 1, id, data.periodKey)
        } else if (isCompleted && periodAmount < goal) {
          setIsCompleted(false);
          setCurrentStreak(currentStreak - 1);
          //await historyRepo.setPeriod("streak", currentStreak - 1, id, data.periodKey)
          //await historyRepo.setPeriod("completed", 0, id, data.periodKey)
        }
      } catch (err) {
        console.error(
          "error setting the streak in Habit.jsx",
          err,
          "from src:",
          src
        );
      }
      //}
    };

    const inner = async () => {
      if (dynamicData == null && amount > 0) {
        //console.log("Action heard, creating entry")

        const historyData = await historyRepo.getEntryWithCheck(
          id,
          selectedDate
        );
        setDynamicData(historyData);
        // Wait for setDynamicData to finish and dynamicData to update
        // Instead of relying on dynamicData (which is async), pass historyData directly
        await updateHabitCompletion(amount, historyData);
        await setStreaks();
      } else {
        await setStreaks();
      }

      // console.log(
      //   "Completed:",
      //   isCompleted,
      //   "PeriodAmount:",
      //   periodAmount,
      //   "Goal:",
      //   goal
      // );

      //if (currentStreak == dynamicData.streak) {

      //}
    };
    inner();
  }, [amount]);

  const addMetric = (value) => {
    const newAmount = amount + value <= 0 ? 0 : amount + value;
    setAmount(newAmount);
    setPeriodAmount((prev) => (prev + value <= 0 ? 0 : prev + value));
    updateHabitCompletion(newAmount);
  };

  const HabitButton = ({ incrementor }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Heavy
          )
          addMetric(incrementor);
        }}
        className={`w-16 h-16 overflow-hidden rounded-2xl justify-center items-center ${
          (incrementor < 0 && amount <= 0) || periodAmount < goal
            ? "bg-background-80"
            : "bg-highlight-60"
        }`}
        disabled={incrementor < 0 && amount <= 0}
      >
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={
              incrementor > 0
                ? periodAmount < goal
                  ? icons.addBox
                  : icons.check
                : icons.subtractLine
            }
            resizeMode="cover"
            className="w-[3rem] h-[3rem]"
            tintColor={
              (incrementor < 0 && amount <= 0) || periodAmount < goal
                ? tailwindColors["highlight"]["80"]
                : tailwindColors["background"]["90"]
            }
          />
        )}
      </TouchableOpacity>
    );
  };

  const HabitCompletionDisplay = () => {
    return (
      <Text className="text-highlight-80 text-lg font-generalsans-medium">
        {" "}
        {/* EDIT remove text-xs*/}
        {periodAmount} / {goal} {label}
      </Text>
    );
  };

  return (
    <HabitBase
      data={{ ...dynamicData, ...data }}
      habitCompletionDisplay={HabitCompletionDisplay}
      habitButton={() => <HabitButton incrementor={1} />}
      habitSubtractButton={
        canSubtract ? () => <HabitButton incrementor={-1} /> : null
      }
      enableStreak={true}
      currentStreak={currentStreak}
      amount={periodAmount}
      goal={goal}
      isCompleted={isCompleted}
    />
  );
});

export default Habit;
