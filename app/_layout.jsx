import { SplashScreen, Stack } from "expo-router";

import "../global.css";

import { LoadingProvider } from "../components/LoadingProvider";

SplashScreen.preventAutoHideAsync();

SplashScreen.hide();

const RootLayout = () => {
  console.log("\n\nNEW RUN " + "\n\n");

  return ( 
    <LoadingProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
      </Stack>
    </LoadingProvider> 
  );
};

export default RootLayout;
