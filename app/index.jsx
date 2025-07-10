import { useFonts } from 'expo-font';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen'


SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'GeneralSans-Regular': require('../assets/fonts/GeneralSans/GeneralSans-Regular.otf'),
    'GeneralSans-Italic': require('../assets/fonts/GeneralSans/GeneralSans-Italic.otf'),
    'GeneralSans-Medium': require('../assets/fonts/GeneralSans/GeneralSans-Medium.otf'),
    'GeneralSans-MediumItalic': require('../assets/fonts/GeneralSans/GeneralSans-MediumItalic.otf'),
    'GeneralSans-SemiBold': require('../assets/fonts/GeneralSans/GeneralSans-Semibold.otf'),
    'GeneralSans-SemiBoldItalic': require('../assets/fonts/GeneralSans/GeneralSans-SemiboldItalic.otf'),
    'GeneralSans-Bold': require('../assets/fonts/GeneralSans/GeneralSans-Bold.otf'),
    'GeneralSans-BoldItalic': require('../assets/fonts/GeneralSans/GeneralSans-BoldItalic.otf'),
    'GeneralSans-Light': require('../assets/fonts/GeneralSans/GeneralSans-Light.otf'),
    'GeneralSans-LightItalic': require('../assets/fonts/GeneralSans/GeneralSans-LightItalic.otf'),
    'GeneralSans-ExtraLight': require('../assets/fonts/GeneralSans/GeneralSans-Extralight.otf'),
    'GeneralSans-ExtraLightItalic': require('../assets/fonts/GeneralSans/GeneralSans-ExtralightItalic.otf'),
    'Lora-Regular': require('../assets/fonts/Lora/Lora-Regular.ttf'),
    'Lora-Medium': require('../assets/fonts/Lora/Lora-Medium.ttf'),
    'Lora-SemiBold': require('../assets/fonts/Lora/Lora-SemiBold.ttf'),
    'Lora-Bold': require('../assets/fonts/Lora/Lora-Bold.ttf'),
    'Lora-Italic': require('../assets/fonts/Lora/Lora-Italic.ttf'),
    'Lora-MediumItalic': require('../assets/fonts/Lora/Lora-MediumItalic.ttf'),
    'Lora-SemiBoldItalic': require('../assets/fonts/Lora/Lora-SemiBoldItalic.ttf'),
    'Lora-BoldItalic': require('../assets/fonts/Lora/Lora-BoldItalic.ttf'),
    'SourceSans3-ExtraLight': require('../assets/fonts/SourceSans/SourceSans3-ExtraLight.ttf'),
    'SourceSans3-Light': require('../assets/fonts/SourceSans/SourceSans3-Light.ttf'),
    'SourceSans3-Regular': require('../assets/fonts/SourceSans/SourceSans3-Regular.ttf'),
    'SourceSans3-Medium': require('../assets/fonts/SourceSans/SourceSans3-Medium.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans/SourceSans3-SemiBold.ttf'),
    'SourceSans3-Bold': require('../assets/fonts/SourceSans/SourceSans3-Bold.ttf'),
    'SourceSans3-ExtraBold': require('../assets/fonts/SourceSans/SourceSans3-ExtraBold.ttf'),
    'SourceSans3-Black': require('../assets/fonts/SourceSans/SourceSans3-Black.ttf'),
    'SourceSans3-ExtraLightItalic': require('../assets/fonts/SourceSans/SourceSans3-ExtraLightItalic.ttf'),
    'SourceSans3-LightItalic': require('../assets/fonts/SourceSans/SourceSans3-LightItalic.ttf'),
    'SourceSans3-Italic': require('../assets/fonts/SourceSans/SourceSans3-Italic.ttf'),
    'SourceSans3-MediumItalic': require('../assets/fonts/SourceSans/SourceSans3-MediumItalic.ttf'),
    'SourceSans3-SemiBoldItalic': require('../assets/fonts/SourceSans/SourceSans3-SemiBoldItalic.ttf'),
    'SourceSans3-BoldItalic': require('../assets/fonts/SourceSans/SourceSans3-BoldItalic.ttf'),
    'SourceSans3-ExtraBoldItalic': require('../assets/fonts/SourceSans/SourceSans3-ExtraBoldItalic.ttf'),
    'SourceSans3-BlackItalic': require('../assets/fonts/SourceSans/SourceSans3-BlackItalic.ttf'),
  })

 

  const [appReady, setAppReady] = useState(false)

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Wait for 2 seconds before hiding the splash screen
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView className="justify-center items-center w-full h-full bg-background" onLayout={onLayoutRootView}>
      <Text className="text-2xl text-white">Habit Tracker</Text>
      <Link href="/home" className='text-blue-500 mt-5'>Testing</Link>
    </SafeAreaView>
  );
}
