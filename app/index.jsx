import { usePathname, useRouter } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const router = useRouter();
  const { session } = useAuth(); // Remove error to prevent unnecessary rerenders
  const [appReady, setAppReady] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasInitialNavigation, setHasInitialNavigation] = useState(false);

  // Handle initial splash screen (simplified without font loading)
  const onLayoutRootView = useCallback(async () => {
    // Fonts are loaded by expo-font plugin, so we can hide splash immediately
    await SplashScreen.hideAsync();
    setInitialLoadComplete(true);
  }, []);

  // Handle navigation based on auth state changes
  console.log("🎯 INDEX.JSX - Auth state changed:", {
    session: session ? "EXISTS" : "NO_SESSION",

    initialLoadComplete,

  });

  // Handle initial navigation only once after app loads
  useEffect(() => {
    const handleInitialNavigation = async () => {
      // Wait for auth to finish loading and splash screen to be ready
      if (!initialLoadComplete || hasInitialNavigation) {
        return;
      }

      console.log("🚀 Performing initial navigation");

      if (session) {
        console.log("✅ User is logged in, navigating to home");
        router.replace("/(app)/home");
      } else {
        console.log("🔐 No session, checking onboarding status");
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        if (hasOnboarded === "true") {
          console.log("📝 User has onboarded, navigating to signup");
          router.replace("/auth/signup");
        } else {
          console.log("🎯 User needs onboarding, navigating to onboarding");
          router.replace("/onboarding/onboardingScreen");
        }
      }

    };

    handleInitialNavigation();
  }, [session, initialLoadComplete]);


  return (
    <SafeAreaView
      className="justify-center items-center w-full h-full bg-background"
      onLayout={onLayoutRootView}
    ></SafeAreaView>
  );
}
