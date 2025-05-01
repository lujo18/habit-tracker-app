import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Calendar from './Calendar';

const HeatMapCalendar = ({ habitHistory, selectedDay, setSelectedDay, color = "#0A72D4", selectedAmount }) => {
  
  useEffect(() => {
    console.log(selectedAmount)
  }, [selectedAmount])

  const calendarIcons = (date, selectedDate, selectedMonth) => {

    const data = habitHistory.filter(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
    
    return (
      <TouchableOpacity
      onPress={() => {
        setSelectedDay(date);
      }}
      className={`flex-1 relative rounded-xl items-center justify-center p-2 box-border py-4 overflow-hidden
        ${
        date.getUTCDate() == selectedDate &&
        date.getUTCMonth() == selectedMonth
          ? "border-2 border-white box-border"
          : "border-2 border-transparent"
        }
      `}
    

      disabled={date.getUTCMonth() != selectedMonth}
      >
      <View className='absolute top-0 left-0 right-0 bottom-0 rounded-xl'
        style={ date.getUTCMonth() == selectedMonth && {
          backgroundColor: data.length > 0 ? color : "transparent",
          opacity: data.length > 0 ? (selectedDate == date.getUTCDate() ? selectedAmount : data[0].completionCount) / data[0].goal : 1
        }}
      >

      </View>
      <Text
        className={`${
        date.getUTCMonth() != selectedMonth
          ? "text-background-60"
          : "text-highlight"
        }`}
      >
        {date.getUTCDate()}
      </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Calendar
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      color={color}
      customCalendarIcon={calendarIcons}
    />
  );
};

export default HeatMapCalendar;
