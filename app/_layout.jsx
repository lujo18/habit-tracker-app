import { SplashScreen, Stack } from 'expo-router'

import "../global.css"

SplashScreen.preventAutoHideAsync()

SplashScreen.hide()

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout

