import { useState } from "react"
import { View, Text, TouchableOpacity, Platform, TextInput } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  icon?: React.ReactNode
  maximumDate?: Date
  placeholder?: string
}

const formatDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const DateInputField = ({
  label,
  value,
  onChange,
  error,
  icon,
  maximumDate,
  placeholder = "Chọn ngày",
}: Props) => {
  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState<Date | null>(value ? convertInputToDate(value) : null)

  function convertInputToDate(input: string): Date {
    const [dd, mm, yyyy] = input.split("/")
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  }

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false)
    if (selectedDate) {
      setDate(selectedDate)
      onChange(formatDate(selectedDate))
    }
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-secondary-dark">{label}</Text>
      <TouchableOpacity
        className="bg-gray-100 px-4 py-3 rounded-xl"
        onPress={() => setShowPicker(true)}
      >
        <View className="flex-row items-center">
          {icon}
          <Text className="text-secondary ml-2">
            {value ? value : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
      {showPicker && (
        <DateTimePicker
          value={date || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={maximumDate}
        />
      )}
    </View>
  )
}

export default DateInputField