import { Stack } from "expo-router";

import "../global.css";

import { LoadingProvider } from "../components/LoadingProvider";
import { DateProvider } from "../contexts/DateContext";
import { HabitUpdateProvider } from "../contexts/HabitUpdateContext";


const RootLayout = () => {
  console.log("\n\nNEW RUN " + "\n\n");

  return ( 
    <HabitUpdateProvider>
      <LoadingProvider>
        <DateProvider>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="habitAnalytics" />
            <Stack.Screen name="habitEditor" />
          </Stack>
        </DateProvider>
      </LoadingProvider> 
    </HabitUpdateProvider>
  );
};

export default RootLayout;
