import { SplashScreen, Stack } from "expo-router";

import "../global.css";

import { LoadingProvider } from "../components/LoadingProvider";
import { DateProvider } from "../contexts/DateContext";

SplashScreen.preventAutoHideAsync();

SplashScreen.hide();

const RootLayout = () => {
  console.log("\n\nNEW RUN " + "\n\n");

  return ( 
    <LoadingProvider>
      <DateProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </DateProvider>
    </LoadingProvider> 
  );
};

export default RootLayout;
