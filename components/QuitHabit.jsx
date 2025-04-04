import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import HabitBase from "./HabitBase";
import icons from '../constants/icons'


import tailwindConfig from '../tailwind.config'
import { useLoading } from './LoadingProvider'



const QuitHabit = ({ data, handleReset }) => {
  const { id, name, repeat, startTime, currentDuration, lastResetReason } = data;

  const [currentTime, setCurrentTime] = useState(new Date());

  const tailwindColors = tailwindConfig.theme.extend.colors
  
  const { isLoading } = useLoading();

  useEffect(() => {
    setCurrentTime(Math.abs(new Date() - new Date(startTime)) / 1000);
    setInterval(() => {
      setCurrentTime(Math.abs(new Date() - new Date(startTime)) / 1000);
    }, 1000)
  }, []);

  const habitCompletionDisplay = () => {
    const days = Math.floor(currentTime / (60 * 60 * 24));
    const hours = Math.floor((currentTime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor(((currentTime % (60 * 60 * 24)) % (60 * 60)) / (60));
    const seconds = Math.floor(((currentTime % (60 * 60 * 24)) % (60 * 60)) % (60));

    const timeParts = [];

    if (days > 0) timeParts.push(`${days}D`);
    if (hours > 0) timeParts.push(`${hours}HR`);
    if (minutes > 0) timeParts.push(`${minutes}M`);
    if (seconds > 0) timeParts.push(`${seconds}S`);

    return (
      <Text className="text-highlight-80">
        {timeParts.join(" ")}
      </Text>
    );
  };

  const HabitButton = () => {
    return (
      <TouchableOpacity
        onPress={handleReset}
        className="w-16 h-16 overflow-hidden rounded-2xl justify-center items-center bg-background-80"
      >
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            source={icons.resetArrow}
            resizeMode="cover"
            className="w-[3rem] h-[3rem]"
            tintColor={
              tailwindColors["highlight"]["80"]    
            }
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <HabitBase
      data={data}
      habitCompletionDisplay={habitCompletionDisplay}
      habitButton={HabitButton}
    />
  );
};

export default QuitHabit;
