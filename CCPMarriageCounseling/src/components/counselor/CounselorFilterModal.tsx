"use client"

import { useState, useEffect } from "react"
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native"
import { X, DollarSign, Clock, Award, RotateCcw, Check } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

interface SubCategory {
  id: string
  name: string
}

interface FilterState {
  minPrice: string
  maxPrice: string
  minYear: string
  maxYear: string
  selectedSubCategories: string[]
}

interface Props {
  visible: boolean
  onClose: () => void
  onApply: (filter: FilterState) => void
  allSubCategories: SubCategory[]
  initialFilter?: FilterState
}

const { width } = Dimensions.get("window")

const CounselorFilterModal = ({ visible, onClose, onApply, allSubCategories, initialFilter }: Props) => {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minYear, setMinYear] = useState("")
  const [maxYear, setMaxYear] = useState("")
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])

  useEffect(() => {
    if (initialFilter) {
      setMinPrice(initialFilter.minPrice || "")
      setMaxPrice(initialFilter.maxPrice || "")
      setMinYear(initialFilter.minYear || "")
      setMaxYear(initialFilter.maxYear || "")
      setSelectedSubCategories(initialFilter.selectedSubCategories || [])
    }
  }, [initialFilter, visible])

  const handleApply = () => {
    onApply({
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      selectedSubCategories,
    })
    onClose()
  }

  const handleReset = () => {
    setMinPrice("")
    setMaxPrice("")
    setMinYear("")
    setMaxYear("")
    setSelectedSubCategories([])
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/30 justify-end">
        <View
          className="bg-white rounded-tl-3xl rounded-bl-3xl shadow-2xl"
          style={{
            width: width * 0.85,
            alignSelf: "flex-end",
            height: "100%",
            padding: 24,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">Bộ lọc chuyên gia</Text>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-gray-100" activeOpacity={0.7}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Price Range Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-pink-50 p-2 rounded-xl mr-3">
                  <DollarSign size={20} color="#E83E8C" />
                </View>
                <Text className="text-lg font-semibold text-gray-800">Khoảng giá (VNĐ)</Text>
              </View>
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-2">Tối thiểu</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
                    placeholder="0"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-2">Tối đa</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
                    placeholder="1,000,000"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Experience Years Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-blue-50 p-2 rounded-xl mr-3">
                  <Clock size={20} color="#3B82F6" />
                </View>
                <Text className="text-lg font-semibold text-gray-800">Số năm kinh nghiệm</Text>
              </View>
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-2">Tối thiểu</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
                    placeholder="0"
                    keyboardType="numeric"
                    value={minYear}
                    onChangeText={setMinYear}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-2">Tối đa</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base"
                    placeholder="20"
                    keyboardType="numeric"
                    value={maxYear}
                    onChangeText={setMaxYear}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Specialties Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-green-50 p-2 rounded-xl mr-3">
                  <Award size={20} color="#10B981" />
                </View>
                <Text className="text-lg font-semibold text-gray-800">Chuyên môn</Text>
              </View>
              <View className="flex-row flex-wrap">
                {allSubCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setSelectedSubCategories((prev) =>
                        prev.includes(cat.id) ? prev.filter((id) => id !== cat.id) : [...prev, cat.id],
                      )
                    }}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
                      selectedSubCategories.includes(cat.id)
                        ? "bg-pink-500 border-pink-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      {selectedSubCategories.includes(cat.id) && <Check size={14} color="#fff" className="mr-1" />}
                      <Text
                        className={`text-sm font-medium ${
                          selectedSubCategories.includes(cat.id) ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="pt-4 border-t border-gray-100">
            {/* Apply Button */}
            <TouchableOpacity
              onPress={handleApply}
              className="rounded-2xl overflow-hidden shadow-md mb-3"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#E83E8C", "#FF6B9D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4 items-center"
              >
                <Text className="text-white font-bold text-lg">Áp dụng bộ lọc</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Reset and Close Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleReset}
                className="flex-1 bg-gray-100 rounded-2xl p-3 flex-row items-center justify-center"
                activeOpacity={0.7}
              >
                <RotateCcw size={16} color="#6B7280" />
                <Text className="text-gray-700 font-semibold ml-2">Đặt lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-pink-50 rounded-2xl p-3 items-center border border-pink-200"
                activeOpacity={0.7}
              >
                <Text className="text-pink-600 font-semibold">Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CounselorFilterModal
