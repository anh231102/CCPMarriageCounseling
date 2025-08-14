// App.tsx
"use client"
import "./global.css"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import MainNavigator from "./src/navigation/MainNavigator"
import AuthNavigator from "./src/navigation/AuthNavigator"
import { AuthProvider, useAuth } from "./src/contexts/AuthContext"
import Loading from "./src/components/share/Loading" 
import { LogBox } from 'react-native'


import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // chỉ log warning và error
  strict: false, // tắt strict mode => không hiện cảnh báo
});

const Stack = createNativeStackNavigator()

function AppContent() {
  const { isAuth, isLoading } = useAuth()

  if (isLoading) {
    return <Loading /> 
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {isAuth ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default function App() {
  LogBox.ignoreLogs(['[Reanimated] Reading from `value` during component render']);
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
