// src/components/TranslateText.tsx
"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import axios from "axios"

const TranslateText = () => {
  const [input, setInput] = useState("")
  const [translated, setTranslated] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await axios.post("https://libretranslate.de/translate", {
        q: input,
        source: "en",
        target: "vi",
        format: "text",
      })

      setTranslated(response.data.translatedText)
    } catch (error) {
      console.error("Lỗi dịch:", error)
      setTranslated("Không thể dịch nội dung.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">Nhập nội dung cần dịch:</Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter text in English..."
        placeholderTextColor="#6C757D"
        multiline
        className="border border-gray-300 rounded-md p-3 mb-3 bg-white"
        style={{ minHeight: 100 }}
      />

      <TouchableOpacity
        onPress={handleTranslate}
        className="bg-primary rounded-xl py-3 px-5 items-center mb-4"
      >
        <Text className="text-white font-bold">Dịch sang tiếng Việt</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#EC4899" />
      ) : translated ? (
        <View className="bg-gray-100 rounded-md p-3">
          <Text className="text-secondary-dark font-medium">Kết quả dịch:</Text>
          <Text className="text-base mt-2">{translated}</Text>
        </View>
      ) : null}
    </View>
  )
}

export default TranslateText
