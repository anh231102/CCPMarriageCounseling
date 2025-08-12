"use client";
import { View, Text, TextInput, type ViewStyle } from "react-native"
import type { ReactNode } from "react"

interface InputFieldProps {
  label: string
  icon?: ReactNode
  rightIcon?: ReactNode
  placeholder?: string
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  secureTextEntry?: boolean
  value: string
  onChangeText: (text: string) => void
  className?: string
  style?: ViewStyle
  error?: string
}

const InputField = ({
  label,
  icon,
  rightIcon,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  value,
  onChangeText,
  className = "",
  style,
  error,
}: InputFieldProps) => {
  return (
    <View className={`mb-4 ${className}`} >
      <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      <View
        className={`flex-row items-center border rounded-xl p-3 bg-gray-50 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          className="flex-1 text-foreground"
          placeholder={placeholder}
          placeholderTextColor="#6C757D"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
        {rightIcon && <View>{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  )
}

export default InputField
