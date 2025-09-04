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
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native"

import { useAuth } from "@/src/contexts/AuthContext"
import CustomButton from "@/src/components/CustomButton"
import InputField from "@/src/components/InputField"
import type { AuthStackParamList } from "@/src/navigation/AuthNavigator"
import Logo from "@/src/components/share/Logo"
import Loading from "@/src/components/share/Loading"

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { login, isLoading } = useAuth()
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      setErrors({});
    } catch (error: any) {
      let apiError = "Email hoặc mật khẩu không đúng";
      if (error.response && (error.response.data?.error || error.response.data?.message)) {
        apiError = error.response.data.error || error.response.data.message;
      }
      setErrors((prev) => ({ ...prev, api: apiError }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }} // Sử dụng style thay vì className
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Có thể điều chỉnh offset nếu cần
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

          <View className=" mb-9">
            <View>
              <Text className="text-sm font-medium text-secondary-dark mb-1">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-gray-50">
                <Mail size={20} color="#6C757D" />
                <TextInput
                  className="flex-1 ml-2 text-secondary-dark"
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="#6C757D"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email && <Text style={{ color: "red", marginTop: 4 }}>{errors.email}</Text>}
            </View>

            <View className="mt-6">
              <Text className="text-sm font-medium text-secondary-dark mb-1">Mật khẩu</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-gray-50">
                <Lock size={20} color="#6C757D" />
                <TextInput
                  className="flex-1 ml-2 text-secondary-dark"
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#6C757D"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#6C757D" /> : <Eye size={20} color="#6C757D" />}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={{ color: "red", marginTop: 4 }}>{errors.password}</Text>}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} className="mt-4">

              {/* Lỗi API nếu có */}
              <View>
                {errors.api && (
                  <Text style={{ color: "red", marginLeft: 8, }}>{errors.api}</Text>
                )}
              </View>

              {/* Nút Quên mật khẩu luôn bên phải */}
              {/* <View style={{ alignSelf: "flex-end",  }}>
                <CustomButton
                  onPress={() => navigation.navigate("ForgotPassword")}
                  variant="link"
                >
                  <Text className="text-primary font-medium">Quên mật khẩu?</Text>
                </CustomButton>
              </View> */}
            </View>
          </View>

          <CustomButton
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-md p-4"
          >
            {loading ? (
              <Loading color="#fff" size={30} />
            ) : (
              <Text className="text-primary-foreground font-bold text-lg">Đăng nhập</Text>
            )}
          </CustomButton>

          <View className="flex-row justify-center mt-8">
            <Text className="text-secondary">Bạn chưa có tài khoản? </Text>
            <CustomButton onPress={() => navigation.navigate("Register")} variant="link">
              <Text className="text-primary font-medium">Đăng ký ngay</Text>
            </CustomButton>
          </View>

          {/* <View className="mt-10">
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
          </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
