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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
