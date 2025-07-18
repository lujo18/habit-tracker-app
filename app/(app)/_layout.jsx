import { Stack } from "expo-router";

import { DateProvider } from "../../contexts/DateContext";
import { HabitUpdateProvider } from "../../contexts/HabitUpdateContext";
import { HabitBriefProvider } from "../../contexts/HabitBriefContext";

const RootLayout = () => {
  return (
    <HabitUpdateProvider>
      <DateProvider>
        <HabitBriefProvider>
          <Stack screenOptions={{ headerShown: false }}/>
            {/* <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="habitAnalytics" />
            <Stack.Screen name="habitEditor" /> */}
          {/* </Stack> */}
        </HabitBriefProvider>
      </DateProvider>
    </HabitUpdateProvider>
  );
};

export default RootLayout;
