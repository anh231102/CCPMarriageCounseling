"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ArrowLeft, Eye, EyeOff, Mail, User, Lock } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import Logo from "@/src/components/share/Logo"
import Loading from "@/src/components/share/Loading"

type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  InterestSelection: undefined
}

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const { register, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; api?: string }>({});

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await register(email, password, name);
      Alert.alert("Đăng ký thành công", "Bạn đã đăng ký tài khoản thành công!");
      navigation.navigate("Login");
    } catch (error) {
      const err = error as any;
      let apiError = "Đã xảy ra lỗi khi đăng ký tài khoản";
      if (err.response && (err.response.data?.error || err.response.data?.message)) {
        apiError = err.response.data.error || err.response.data.message;
      }
      setErrors((prev) => ({ ...prev, api: apiError }));
      
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }} // Sử dụng style thay vì className
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Có thể điều chỉnh offset nếu cần

    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-6"
          >
            <ArrowLeft size={20} color="#6C757D" />
          </TouchableOpacity>

          <View className="items-center mb-8 mt-4">
            <Logo size={60} />
            <Text className="text-3xl font-bold text-primary">CCP</Text>
            <Text className="text-base text-secondary mt-1">Nền tảng tư vấn hôn nhân</Text>
          </View>

          <Text className="text-2xl font-bold text-secondary-dark mb-6">Tạo tài khoản</Text>

          <View>
            <Text className="text-sm font-medium text-secondary-dark mb-1">Họ và tên</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-gray-50">
              <User size={20} color="#6C757D" />
              <TextInput
                className="flex-1 ml-2 text-secondary-dark"
                placeholder="Nhập họ và tên của bạn"
                placeholderTextColor="#6C757D"
                value={name}
                onChangeText={setName}
              />
            </View>
            {errors.name && <Text style={{ color: "red", marginTop: 4 }}>{errors.name}</Text>}
          </View>

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

          <View>
            <Text className="text-sm font-medium text-secondary-dark mb-1">Mật khẩu</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-gray-50">
              <Lock size={20} color="#6C757D" />
              <TextInput
                className="flex-1 ml-2 text-secondary-dark"
                placeholder="Tạo mật khẩu"
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

          <View>
            <Text className="text-sm font-medium text-secondary-dark mb-1">Xác nhận mật khẩu</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl p-3 bg-gray-50">
              <Lock size={20} color="#6C757D" />
              <TextInput
                className="flex-1 ml-2 text-secondary-dark"
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#6C757D"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color="#6C757D" /> : <Eye size={20} color="#6C757D" />}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={{ color: "red", marginTop: 4 }}>{errors.confirmPassword}</Text>}
          </View>
          <View className="py-4">
            {/* Lỗi trả về từ API */}
            {errors.api && (
              <Text style={{ color: "red", marginTop: 12 }}>{errors.api}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className={`rounded-xl p-4 items-center ${isLoading ? "bg-primary-light" : "bg-primary"}`}
          >
            {isLoading ? (
              <Loading color="#FFFFFF" size={30} />
            ) : (
              <Text className="text-white font-bold text-lg">Đăng ký</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-secondary">Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-primary font-medium">Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-secondary text-center mt-8">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <Text className="text-primary">Điều khoản sử dụng</Text> và{" "}
            <Text className="text-primary">Chính sách bảo mật</Text> của chúng tôi
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen
