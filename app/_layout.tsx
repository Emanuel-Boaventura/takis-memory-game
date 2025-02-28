import React, { useEffect } from 'react'
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_900Black, useFonts } from '@expo-google-fonts/inter'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

// Prevent the splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync() // Hide the splash screen once fonts are loaded
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }
  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }} />
      <StatusBar style="dark" />
    </>
  )
}
