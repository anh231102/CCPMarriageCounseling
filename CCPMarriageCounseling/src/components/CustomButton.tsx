  "use client";
  import { TouchableOpacity, View, Text, ActivityIndicator } from "react-native"
  import { ReactNode } from "react"

  interface CustomButtonProps {
    onPress?: () => void
    children: ReactNode
    isLoading?: boolean
    disabled?: boolean
    variant?: "solid" | "outline" | "link" | "ghost"
    className?: string
  }

  const CustomButton = ({
    onPress,
    children,
    isLoading = false,
    disabled = false,
    variant = "solid",
    className = "",
  }: CustomButtonProps) => {
    const baseStyles = "items-center justify-center"
    const variantStyles = {
      solid: "bg-primary rounded-md p-4",
      outline: "border border-primary bg-transparent",
      link: "p-0",
      ghost: "bg-transparent p-0",
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled || isLoading ? "opacity-50" : ""}`}
      >
        {isLoading ? <ActivityIndicator color="#FFFFFF" /> : children}
      </TouchableOpacity>
    )
  }

  export default CustomButton