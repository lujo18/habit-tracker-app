import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { generateDates, getMonthName } from "../utils/dateRetriver";
import { endOfMonth } from "date-fns";

const Calendar = ({selectedDay, setSelectedDay, color = "#0A72D4", customCalendarIcon, allowFutureDates}) => {
  const endOfCurrentMonth = endOfMonth(new Date());
  const endOfCalendarDay = new Date().setDate(
    endOfCurrentMonth.getUTCDate() + (12 - endOfCurrentMonth.getUTCDay())
  );
  const endOfCalendar = new Date(endOfCalendarDay).setMonth(
    endOfCurrentMonth.getMonth() + 1
  );

  const dates = useMemo(() => 
    generateDates("2023-12-31", endOfCalendar), 
    [endOfCalendar]
  );
  const selectedMonth = selectedDay.getUTCMonth();
  const selectedYear = selectedDay.getUTCFullYear();
  const selectedDate = selectedDay.getUTCDate();

  const setSelectedMonth = (month) => {
    setSelectedDay(selectedDay.setUTCMonth(month))
  }

  const setSelectedYear = (year) => {
    setSelectedDay(selectedDay.setFullYear(year))
  }
  // Check: Generate dates from a year back up until the end of current month
  // Have a state that hold a month and a year in it
  // Everytime it changes, map the dates that match the month and year
  // Take that map and generate a flatlist with icons for each date
  // Take in the habit history and repeat through all history for matching M & Y
  // Change the effect on the calendar dates based on completionCount/goal
  const selectedDates = useMemo(() => {
    const filteredDates = dates.filter(
      (date) =>
        date.getUTCMonth() === selectedMonth &&
        date.getUTCFullYear() === selectedYear
    );

    const firstDayOfMonth = filteredDates[0]?.getUTCDay() || 0;
    const proceedingDays = dates
      .filter((date) => {
        const previousMonth = selectedMonth == 0 ? 11 : selectedMonth - 1;
        const previousYear =
          selectedMonth == 0 ? selectedYear - 1 : selectedYear;
        return (
          date.getUTCMonth() === previousMonth &&
          date.getUTCFullYear() === previousYear &&
          date.getUTCDay() < firstDayOfMonth
        );
      })
      .slice(-firstDayOfMonth);

    const lastDayOfMonth =
      filteredDates[filteredDates.length - 1]?.getUTCDay() || 0;
    const followingDays = dates
      .filter((date) => {
        const nextMonth = selectedMonth == 11 ? 0 : selectedMonth + 1;
        const nextYear = selectedMonth == 11 ? selectedYear + 1 : selectedYear;
        return (
          date.getUTCMonth() === nextMonth && date.getUTCFullYear() === nextYear
        );
      })
      .slice(0, lastDayOfMonth < 2 ? 6 - lastDayOfMonth : 13 - lastDayOfMonth);

    return [...proceedingDays, ...filteredDates, ...followingDays];
  }, [selectedMonth]);

  const changeMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    if (newMonth < 0) {
      setSelectedYear(selectedYear + direction);
      newMonth = 11;
    } else if (newMonth > 11) {
      setSelectedYear(selectedYear + direction);
      newMonth = 0;
    }

    setSelectedMonth(newMonth);

    const newDate = new Date(selectedDay)
    newDate.setUTCDate(1)
    setSelectedDay(newDate)
    //}
  };

  const CalendarButton = ({ name, direction, disabled }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          changeMonth(direction);
        }}
        disabled={disabled}
      >
        <Text
          className={`${disabled ? "text-background-60" : "text-highlight-90"}`}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const defaultCalendarIcons = useCallback((date) => {
    const isCurrentMonth = date.getUTCMonth() === selectedMonth;
    const isSelected = date.getUTCDate() === selectedDate && isCurrentMonth;
    const isFutureDisabled = !allowFutureDates && 
                             date.getUTCDate() > new Date().getDate() && 
                             date.getUTCMonth() === new Date().getUTCMonth();
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedDay(date)}
        className={`flex-1 rounded-xl items-center justify-center p-2 py-4`}
        style={isSelected ? { backgroundColor: color } : undefined}
        disabled={isFutureDisabled || !isCurrentMonth}
      > 
        <Text
          className={`${!isCurrentMonth ? "text-background-60" : "text-highlight"}`}
        >
          {date.getUTCDate()}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedDate, selectedMonth, allowFutureDates, color]);

  // Move complex disabled logic to useMemo
  const prevButtonDisabled = useMemo(() => {
    if (selectedMonth - 1 < 0) {
      return 11 === dates[0].getUTCMonth() && selectedYear - 1 === dates[0].getUTCFullYear();
    }
    return selectedMonth - 1 === dates[0].getUTCMonth() && selectedYear === dates[0].getUTCFullYear();
  }, [selectedMonth, selectedYear, dates]);

  const nextButtonDisabled = useMemo(() => {
    if (selectedMonth + 1 > 11) {
      return 0 === dates[dates.length - 1].getUTCMonth() && 
             selectedYear + 1 === dates[dates.length - 1].getUTCFullYear();
    }
    return selectedMonth + 1 === dates[dates.length - 1].getUTCMonth() && 
           selectedYear === dates[dates.length - 1].getUTCFullYear();
  }, [selectedMonth, selectedYear, dates]);

  return (
    <View className="flex-1 w-full py-4">
      <View className="flex-row gap-4 items-center pb-2 border-b-2 border-background-70">
        <View className="flex-1">
          <CalendarButton
            name="Previous"
            direction={-1}
            disabled={prevButtonDisabled}
          />
        </View>
        <View className="flex-2 items-center gap-2">
          <Text className="font-bold text-white text-2xl">
            {getMonthName(selectedMonth)}
          </Text>
          <Text className="text-highlight-70">{selectedYear}</Text>
        </View>
        <View className="flex-1 items-end">
          <CalendarButton
            name="Next"
            direction={1}
            disabled={nextButtonDisabled}
          />
        </View>
      </View>

      <FlatList
        data={
          selectedDates /*.concat(
          Array.from(
            { length: (7 - (selectedDates.length % 7)) % 7 },
            () => null
          )
        )*/
        }
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => (
          customCalendarIcon ? customCalendarIcon(item, selectedDate, selectedMonth, allowFutureDates) : defaultCalendarIcons(item)
        )}
        numColumns={7}
        initialNumToRender={35}
        contentContainerStyle={{ padding: 4 }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default memo(Calendar);
