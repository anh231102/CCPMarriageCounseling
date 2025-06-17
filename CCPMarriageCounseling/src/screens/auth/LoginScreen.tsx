import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native"

import { useAuth } from "@/src/contexts/AuthContext"
import CustomButton from "@/src/components/CustomButton"
import InputField from "@/src/components/InputField"
import type { AuthStackParamList } from "@/src/navigation/AuthNavigator"
import Logo from "@/src/components/share/Logo" 

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email")
      return
    }

    if (!password) {
      Alert.alert("Thông báo", "Vui lòng nhập mật khẩu")
      return
    }

    try {
      await login(email.trim(), password)
      
      
    } catch (error) {
      Alert.alert("Lỗi đăng nhập", "Email hoặc mật khẩu không đúng")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-6 pt-32">
          <View className="items-center mb-10">
            <View className=" ">
              <Logo size={60} />
            </View>
            <Text className="text-3xl font-bold text-primary">CCP</Text>
            <Text className="text-lg text-secondary mt-2">Nền tảng tư vấn hôn nhân</Text>
          </View>

          <Text className="text-2xl font-bold text-foreground mb-6">Đăng nhập</Text>

          <View className="space-y-4 mb-6">
            <InputField
              label="Email"
              icon={<Mail size={20} color="#6C757D" />}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              
              value={email}
              onChangeText={setEmail}
            />

            <InputField
              label="Mật khẩu"
              icon={<Lock size={20} color="#6C757D" />}
              placeholder="Nhập mật khẩu của bạn"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              rightIcon={
                <CustomButton
                  onPress={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  className="p-0"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6C757D" />
                  ) : (
                    <Eye size={20} color="#6C757D" />
                  )}
                </CustomButton>
              }
            />

            <CustomButton
              onPress={() => navigation.navigate("ForgotPassword")}
              variant="link"
              className="self-end"
            >
              <Text className="text-primary font-medium">Quên mật khẩu?</Text>
            </CustomButton>
          </View>

          <CustomButton
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-md p-4"
          >
            <Text className="text-primary-foreground font-bold text-lg">Đăng nhập</Text>
          </CustomButton>

          <View className="flex-row justify-center mt-8">
            <Text className="text-secondary">Bạn chưa có tài khoản? </Text>
            <CustomButton onPress={() => navigation.navigate("Register")} variant="link">
              <Text className="text-primary font-medium">Đăng ký ngay</Text>
            </CustomButton>
          </View>

          <View className="mt-10">
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-secondary">Hoặc đăng nhập với</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <View className="flex-row justify-center space-x-4">
              {["G", "F", "A"].map((provider) => (
                <CustomButton
                  key={provider}
                  variant="outline"
                  className="w-14 h-14 rounded-full bg-background"
                >
                  <Image
                    source={{ uri: `https://placeholder.svg?height=30&width=30&text=${provider}` }}
                    className="w-6 h-6"
                  />
                </CustomButton>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
