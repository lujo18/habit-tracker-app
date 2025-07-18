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

import tailwindConfig from "../tailwind.config";
import { dateToSQL, HabitHistoryRepository, HabitsRepository } from "../db/sqliteManager";
import { DateContext, useDateContext } from "../contexts/DateContext";
import { useLoading } from "./LoadingProvider";
import { formatRepeatText } from "../utils/formatters";
import HabitBase from "./HabitBase";
import * as Haptics from 'expo-haptics'
import { useHabitBrief } from "../contexts/HabitBriefContext";
import { calculateEMA } from "../utils/formulas";

const Habit = memo(({ data, canSubtract, updateSelectedAmount = null, providedSelectedDate }) => {
  const historyRepo = new HabitHistoryRepository();
  const habitsRepo = new HabitsRepository();
  const { isLoading } = useLoading();
  const { addToBrief } = useHabitBrief()
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
    maxGoal,
    location,
    date,
    completed
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


  useEffect(() => {
    const dynmaicHabitResponse = async () => {

      try {
        const data = await habitsRepo.get(id)
        const lastAdjustment = data.lastAdjustmentDate

        const daysSinceLastAdjustment = Math.floor(
          (new Date() - new Date(/*"2025-7-6"*/lastAdjustment)) / (1000 * 60 * 60 * 24) // FIX AFTER TESTING
        )

        console.log("Days since last adjustment:", name, daysSinceLastAdjustment, lastAdjustment);

        if (daysSinceLastAdjustment < 7) {return}


        const lastSevenEntries = await historyRepo.getPreviousDays(id, 7)

        console.log("ENTRIES", lastSevenEntries)

        if (lastSevenEntries) {

          // Get sentimentLevels

            // const sentimentLevels = Array.from({ length: 50 }, (_, i) => (i * 2) / 100)
            const sentimentLevels = Array.from({ length: 10 }, (_, i) => i / 10)
            // get completionRates

            // const completionRates = Array.from({length: 10}, (_, i) => {
            //   const percent = lastSevenEntries.reduce((accumulator, currentValue) => {
            //     const completionRatio = ((currentValue.completionCount / (currentValue?.goal || data?.goal)) || 0)

            //     return accumulator + ((completionRatio >= i / 10) ? 1 : 0 )
            //   }, 0);
            //   return parseFloat((percent / lastSevenEntries.length).toFixed(2))
            // })

            const completionRates = lastSevenEntries.map(entry => 
              entry.goal ? (entry.completionCount / entry.goal) : 0
            )

            console.log("COMPLETION RATES", name, completionRates)

            const habitHealthStatuses = [
              { completionRate: 0, name: "Nonexistent" },
              { completionRate: 0.25, name: "Struggling" },
              { completionRate: 0.5, name: "Developing" },
              { completionRate: 0.75, name: "Consistent" },
              { completionRate: 1, name: "Mastered" }
            ]

            const calcMeanCompletionRate = completionRates.reduce((total, cur) => total + cur) / completionRates.length
            const emaCompletionRate = calculateEMA(completionRates, 0.2)

            console.log("CRS", name, "MEAN:", calcMeanCompletionRate, "EMA:", emaCompletionRate)


            const calcTotalCompletionRate = completionRates.reduce((total, cur) => total + (cur >= .9 ? 1 : 0))
            const highDayRate = calcTotalCompletionRate / 7


            const calcMeanStreak = lastSevenEntries.reduce((total, cur) => total + (cur.streak || 0), 0) / lastSevenEntries.length

            const streaks = lastSevenEntries.map(entry => entry.streak || 0)

            const emaStreak = calculateEMA(streaks, 0.2)
            const normStreak = Math.min(emaStreak / 30, 1)
            console.log("STREAKS", name, "MEAN: ", calcMeanStreak, "EMA: ", emaStreak)

            const score = Math.max((
              (emaCompletionRate * 0.5) +
              (highDayRate * 0.3) +
              (normStreak * 0.2)
            ), 0)

            const healthStatus = (habitHealthStatuses
              .filter(s => score >= s.completionRate)
              .pop() || habitHealthStatuses[0]
            )

            // Get new goal

            console.log("HEALTH", name, "SCORE:", score, "STATUS:", healthStatus)

            const newGoal =
              healthStatus.completionRate <= 0.25 ? 
                sentimentLevels.filter((val, index) => completionRates[index] >= calcMeanCompletionRate).pop() :
              healthStatus.completionRate >= 0.75 && 
                Math.ceil((sentimentLevels.filter((val, index) => (completionRates[index] >= .90)).pop() * .1) + 1)

              
            console.log("NEW GOAL", newGoal)



            if (typeof newGoal == 'number' ) {
              await habitsRepo.updateAdjustmentDate(id, new Date());

              const rawGoal = Math.max(referenceGoal * newGoal, 1)

              const clampedGoal = Math.round(rawGoal)
              const maxUp = referenceGoal * 1.15
              const maxDown = referenceGoal * .85

              const calculatedGoal = Math.ceil(Math.min(Math.floor(Math.max(maxDown, rawGoal)), maxUp))


              if (calculatedGoal <= maxGoal) {
                console.log("ADJUSTING GOAL")

                habitsRepo.setValues(id, ["referenceGoal"], [calculatedGoal])

                console.log("ADD TO BRIEF", {
                  id,
                  name,
                  title: referenceGoal < calculatedGoal ? "Advanced your goal" : "Reduced your goal",
                  description: referenceGoal < calculatedGoal ? "Keep going strong!" : "This is a reajustment, not a setback.",
                  oldValue: referenceGoal,
                  newValue: calculatedGoal,
                  type: "dynamic"
                })

                addToBrief({
                  id,
                  name,
                  title: referenceGoal < calculatedGoal ? "Advanced your goal" : "Reduced your goal",
                  description: referenceGoal < calculatedGoal ? "Keep going strong!" : "This is a reajustment, not a setback.",
                  oldValue: referenceGoal,
                  newValue: calculatedGoal,
                  type: "dynamic"
                })
              }
              
            } else {
              addToBrief({
                id,
                name,
                title: "Your in the development faze",
                description: "Keep building a foundation and soon your habit will be adjusted.",
                oldValue: referenceGoal,
                newValue: referenceGoal,
                type: "dynamic"
              })
            }
          
        }

      } catch (error) {
        console.error("Error fetching last seven entries:", error);
      }
    }

    if (setting === 'dynamic') {
      dynmaicHabitResponse()
    }
  }, []);


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
        {periodAmount} / {goal} {label} {maxGoal}
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
