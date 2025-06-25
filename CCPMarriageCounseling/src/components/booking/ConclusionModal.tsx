// components/ConclusionModal.tsx

import React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"

interface Props {
  visible: boolean
  onClose: () => void
  problemSummary: string | null
  problemAnalysis: string | null
  guides: string | null
}

const ConclusionModal: React.FC<Props> = ({
  visible,
  onClose,
  problemSummary,
  problemAnalysis,
  guides,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white rounded-2xl w-full p-6">
          <Text className="text-lg font-bold text-center mb-4">Kết luận buổi tư vấn</Text>

          <Text className="font-semibold text-primary mb-1">📝 Tóm tắt vấn đề</Text>
          <Text className="text-secondary mb-3">
            {problemSummary || "Không có thông tin"}
          </Text>

          <Text className="font-semibold text-primary mb-1">🔍 Phân tích vấn đề</Text>
          <Text className="text-secondary mb-3">
            {problemAnalysis || "Không có thông tin"}
          </Text>

          <Text className="font-semibold text-primary mb-1">💡 Hướng dẫn & Tư vấn</Text>
          <Text className="text-secondary mb-4">
            {guides || "Không có thông tin"}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-primary p-3 rounded-xl items-center"
          >
            <Text className="text-white font-medium">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ConclusionModal
