
import React from "react"
import { Modal, TouchableOpacity, Animated, Text, View } from "react-native"

interface Props {
  visible: boolean
  onClose: () => void
  slideAnim: Animated.Value
  width: number
  sortType: "newest" | "oldest"
  setSortType: (v: "newest" | "oldest") => void
  statusFilter: number | null
  setStatusFilter: (v: number | null) => void
  sortOptions: { value: string; label: string }[]
  statusOptions: { value: number | null; label: string }[]
}

const BookingFilterModal: React.FC<Props> = ({
  visible,
  onClose,
  slideAnim,
  width,
  sortType,
  setSortType,
  statusFilter,
  setStatusFilter,
  sortOptions,
  statusOptions,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      className="flex-1 bg-black/20"
      activeOpacity={1}
      onPress={onClose}
    >
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-white p-6 shadow-lg rounded-l-3xl"
        style={{
          width: width * 0.75,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Text className="font-bold text-2xl text-gray-800 mb-6">Lọc lịch sử</Text>
        {/* Sort Options */}
        <Text className="mb-3 font-semibold text-gray-700 text-base">Sắp xếp theo</Text>
        <View className="flex-row flex-wrap mb-6">
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setSortType(opt.value as "newest" | "oldest")}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                sortType === opt.value ? "bg-pink-500" : "bg-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <Text className={`font-medium ${sortType === opt.value ? "text-white" : "text-gray-700"}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Status Filter */}
        <Text className="mb-3 font-semibold text-gray-700 text-base">Trạng thái</Text>
        <View className="flex-row flex-wrap mb-8">
          {statusOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value ?? "all"}
              onPress={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                statusFilter === opt.value ? "bg-pink-500" : "bg-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <Text className={`font-medium ${statusFilter === opt.value ? "text-white" : "text-gray-700"}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Apply Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-pink-500 px-6 py-4 rounded-2xl items-center shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Áp dụng bộ lọc</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  </Modal>
)

export default BookingFilterModal