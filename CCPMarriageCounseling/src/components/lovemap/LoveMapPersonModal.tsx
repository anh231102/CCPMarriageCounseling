import React from "react"
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { X } from "lucide-react-native"
import LoveMapSurveyScores from "./LoveMapSurveyScores"
import LoveMapSurveyDetail from "./LoveMapSurveyDetail"

interface Props {
  visible: boolean
  onClose: () => void
  personKey: "member" | "member1"
  coupleData: any
  parseScores: (desc: string | null) => Record<string, number>
}

const LoveMapPersonModal = ({ visible, onClose, personKey, coupleData, parseScores }: Props) => {
  if (!visible || !coupleData || !personKey) return null

  const isFirst = personKey === "member"
  const person = isFirst ? coupleData.member : coupleData.member1
  const name = person?.fullname || coupleData.virtualName || "Đối tác ảo"
  const avatar = person?.avatar || "https://placeholder.svg?height=80&width=80"

  const mbtiData = isFirst ? coupleData.mbtiDescription : coupleData.mbti1Description
  const discData = isFirst ? coupleData.discDescription : coupleData.disc1Description
  const loveLangData = isFirst ? coupleData.loveLanguageDescription : coupleData.loveLanguage1Description
  const bigFiveData = isFirst ? coupleData.bigFiveDescription : coupleData.bigFive1Description

  const mbtiCode = isFirst ? coupleData.mbti : coupleData.mbti1
  const discCode = isFirst ? coupleData.disc : coupleData.disc1
  const loveLangCode = isFirst ? coupleData.loveLanguage : coupleData.loveLanguage1
  const bigFiveCode = isFirst ? coupleData.bigFive : coupleData.bigFive1

  const mbtiDetail = isFirst ? coupleData.mbtiDetail?.personType?.detail : coupleData.mbtiDetail?.personType2?.detail
  const discDetail = isFirst ? coupleData.discDetail?.personType?.detail : coupleData.discDetail?.personType2?.detail
  const loveLangDetail = isFirst
    ? coupleData.loveLanguageDetail?.personType?.detail
    : coupleData.loveLanguageDetail?.personType2?.detail
  const bigFiveDetail = isFirst
    ? coupleData.bigFiveDetail?.personType?.detail
    : coupleData.bigFiveDetail?.personType2?.detail

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-primary p-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">Chi tiết cá nhân</Text>
              <Text className="text-white/90">{name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-white/20 rounded-full p-2">
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Profile */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm items-center">
            <Image source={{ uri: avatar }} className="w-20 h-20 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-secondary-dark mb-2">{name}</Text>
            {person?.dob && (
              <Text className="text-secondary">Sinh năm: {new Date(person.dob).getFullYear()}</Text>
            )}
          </View>

          {/* MBTI */}
          {mbtiData && (
            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <LoveMapSurveyScores
                surveyId="SV001"
                scores={parseScores(mbtiData)}
                name={`MBTI (${mbtiCode || "N/A"})`}
              />
              <LoveMapSurveyDetail title="Chi tiết MBTI" description={mbtiDetail || ""} />
            </View>
          )}

          {/* DISC */}
          {discData && (
            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <LoveMapSurveyScores
                surveyId="SV002"
                scores={parseScores(discData)}
                name={`DISC (${discCode || "N/A"})`}
              />
              <LoveMapSurveyDetail title="Chi tiết DISC" description={discDetail || ""} />
            </View>
          )}

          {/* Love Language */}
          {loveLangData && (
            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <LoveMapSurveyScores
                surveyId="SV003"
                scores={parseScores(loveLangData)}
                name={`Love Language (${loveLangCode || "N/A"})`}
              />
              <LoveMapSurveyDetail title="Chi tiết Love Language" description={loveLangDetail || ""} />
            </View>
          )}

          {/* Big Five */}
          {bigFiveData && (
            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <LoveMapSurveyScores
                surveyId="SV004"
                scores={parseScores(bigFiveData)}
                name={`Big Five (${bigFiveCode || "N/A"})`}
              />
              <LoveMapSurveyDetail title="Chi tiết Big Five" description={bigFiveDetail || ""} />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

export default LoveMapPersonModal
