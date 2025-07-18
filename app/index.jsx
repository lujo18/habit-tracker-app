import { useRouter } from "expo-router";
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
  const { session, error, userProfile, isLoading } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle initial splash screen (simplified without font loading)
  const onLayoutRootView = useCallback(async () => {
    // Fonts are loaded by expo-font plugin, so we can hide splash immediately
    await SplashScreen.hideAsync();
    setInitialLoadComplete(true);
  }, []);

  // Handle navigation based on auth state changes
  useEffect(() => {
    console.log("🎯 INDEX.JSX - Auth state changed:", { 
      session: session ? 'EXISTS' : 'NO_SESSION', 
      isLoading, 
      error: error ? 'HAS_ERROR' : 'NO_ERROR',
      initialLoadComplete
    });

    // Only handle navigation after initial load is complete
    if (!initialLoadComplete) {
      console.log("⏳ Initial load not complete, skipping navigation");
      return;
    }

    // Don't navigate if auth is still loading
    if (isLoading) {
      console.log("🔄 Auth still loading, skipping navigation");
      return;
    }

    // Don't navigate if there's an auth error
    if (error) {
      console.log("❌ Auth error present, not navigating:", error.message);
      return;
    }

    // Handle navigation based on session state
    const handleNavigation = async () => {
      if (session) {
        console.log("✅ User is logged in, navigating to home");
        router.replace("/(app)/home");
      } else {
        console.log("🔐 No session, checking onboarding status");
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
        if (hasOnboarded === 'true') {
          router.replace("/auth/signin");
        } else {
          router.replace("/onboarding/screen1");
        }
      }
      setAppReady(true);
    };

    handleNavigation();
  }, [session, isLoading, error, initialLoadComplete, router]);

  return (
    <SafeAreaView
      className="justify-center items-center w-full h-full bg-background"
      onLayout={onLayoutRootView}
    >
      <Text className="text-2xl text-white">H</Text>
    </SafeAreaView>
  );
}