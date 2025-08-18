import React from "react"
import { Modal, View, Text, TouchableOpacity } from "react-native"
import { ClipboardCheck  } from "lucide-react-native"
import { surveyTypes } from "@/src/config/types/survey.type"

type Props = {
  visible: boolean
  surveyId: string
  onClose: () => void
  onStart?: () => void
}

const SurveyStartModal: React.FC<Props> = ({ visible, surveyId, onClose, onStart }) => {
  const survey = surveyTypes.find(s => s.id === surveyId)
  if (!survey) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md items-center shadow-lg">
          
          {/* Icon trong vòng tròn */}
          <View className="bg-pink-100 p-4 rounded-full mb-4">
            <ClipboardCheck size={32} color="#E83E8C" />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-center text-primary mb-2">
            Bắt đầu khảo sát
          </Text>

          {/* Subtitle */}
          <Text className="text-base font-semibold text-secondary-dark text-center mb-1">
            {survey.name} ({survey.fullNameVi})
          </Text>

          {/* Mô tả */}
          <Text className="text-secondary text-center mb-6">
            {survey.shortTitle}
          </Text>
          <Text className="text-secondary text-center mb-6">
            {survey.description}
          </Text>

          {/* CTA buttons */}
          <TouchableOpacity
            className="bg-primary rounded-xl py-3 px-6 w-full mb-3"
            onPress={onStart || onClose}
          >
            <Text className="text-white text-center font-semibold text-base">Bắt đầu</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </Modal>
  )
}

export default SurveyStartModal
