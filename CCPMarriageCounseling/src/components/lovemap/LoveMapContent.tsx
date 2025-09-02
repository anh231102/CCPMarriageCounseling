// components/lovemap/LoveMapContent.tsx
import React, { useState, useEffect } from "react"
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native"
import {
  Heart,
  Brain,
  Zap,
  Star,
} from "lucide-react-native"

import CompatibilityScore from "./CompatibilityScore"
import AssessmentBlock from "./AssessmentBlock"
import StrengthBlock from "./StrengthBlock"
import WeaknessBlock from "./WeaknessBlock"
import LoveMapPersonModal from "./LoveMapPersonModal"
import RecommendCategory from "../recommend/RecommendCategory"
import CounselorRecommendList from "../counselor/CounselorRecommendList"
import CourseRecommendList from "../courses/CourseRecommendList "
import coupleApi from "../../config/api/couple.api"
import type { Couple } from "../../config/types/couple.type"

const LoveMapContent = ({
  coupleId,
  onClose,
}: {
  coupleId: string
  onClose?: () => void
}) => {
  const [couple, setCouple] = useState<Couple | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPersonDetail, setShowPersonDetail] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<"member" | "member1" | null>(null)
  const [expandedSectionsDetail, setExpandedSectionsDetail] = useState({
    mbti: false,
    disc: false,
    loveLanguage: false,
    bigFive: false,
  })
  const [expandedSectionsStrong, setExpandedSectionsStrong] = useState({
    mbti: false,
    disc: false,
    loveLanguage: false,
    bigFive: false,
  })
  const [expandedSectionsWeak, setExpandedSectionsWeak] = useState({
    mbti: false,
    disc: false,
    loveLanguage: false,
    bigFive: false,
  })

  useEffect(() => {
    if (coupleId) {
      loadCoupleResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId])

  const loadCoupleResult = async () => {
    try {
      setLoading(true)
      const result = await coupleApi.getCoupleResult(coupleId)
      setCouple(result)
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải kết quả bản đồ tình yêu")
      if (onClose) onClose()
    } finally {
      setLoading(false)
    }
  }

  const parseScores = (description: string | null | undefined): Record<string, number> => {
    if (!description) return {}
    const scores: Record<string, number> = {}
    const pairs = description.split(",")
    pairs.forEach((pair) => {
      const [key, value] = pair.split(":")
      if (key && value) {
        scores[key.trim()] = Number.parseInt(value.trim()) || 0
      }
    })
    return scores
  }

  const calculateOverallCompatibility = (couple: Couple): number => {
    let totalScore = 0
    let count = 0
    if (couple.mbti && couple.mbti1) {
      totalScore += 75
      count++
    }
    if (couple.disc && couple.disc1) {
      totalScore += 80
      count++
    }
    if (couple.loveLanguage && couple.loveLanguage1) {
      totalScore += 70
      count++
    }
    if (couple.bigFive && couple.bigFive1) {
      totalScore += 85
      count++
    }
    return count > 0 ? Math.round(totalScore / count) : 0
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text>Đang tải bản đồ tình yêu...</Text>
      </View>
    )
  }

  if (!couple) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
          <Heart size={64} color="#E83E8C" className="mb-4" />
          <Text className="text-2xl font-bold text-secondary-dark mb-2 text-center">Không tìm thấy dữ liệu</Text>
          <Text className="text-secondary text-center mb-6">
            Không thể tải thông tin bản đồ tình yêu. Vui lòng thử lại sau.
          </Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} className="bg-primary rounded-xl px-6 py-3">
              <Text className="text-white font-bold">Đóng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  const partner1 = couple.member
  const partner2Name = couple.isVirtual
    ? (couple.virtualName ?? "Đối tác ảo")
    : (couple.member1?.fullname ?? "Đối tác ảo")
  const partner2Avatar = couple.isVirtual
    ? (couple.virtualAvatar ?? undefined)
    : (couple.member1?.avatar ?? undefined)

  const overallCompatibility = calculateOverallCompatibility(couple)

  const handlePersonDetail = (person: "member" | "member1") => {
    setSelectedPerson(person)
    setShowPersonDetail(true)
  }

  const toggleSectionDetail = (section: keyof typeof expandedSectionsDetail) => {
    setExpandedSectionsDetail((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  const toggleSectionStrong = (section: keyof typeof expandedSectionsStrong) => {
    setExpandedSectionsStrong((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }
  const toggleSectionWeak = (section: keyof typeof expandedSectionsWeak) => {
    setExpandedSectionsWeak((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-1  -mt-4" >
        <CompatibilityScore
          score={overallCompatibility}
          member1={{
            fullname: partner1.fullname ?? "Đối tác 1",
            avatar: partner1.avatar ?? undefined,
          }}
          member2={{
            fullname: partner2Name,
            avatar: partner2Avatar,
          }}
          mbti1={couple.mbti ?? ""}
          mbti2={couple.mbti1 ?? ""}
          onPressPerson={handlePersonDetail}
        />

       {/* Assessment Breakdown */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Chi tiết đánh giá</Text>
          {couple.mbti && couple.mbti1 && (
            <AssessmentBlock
              surveyId="SV001"
              title="MBTI - Tính cách"
              icon={<Brain size={20} color="#E83E8C" />}
              scoreLabel="75%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={couple.mbti ?? ""}
              partner2Code={couple.mbti1 ?? ""}
              partner1Scores={parseScores(couple.mbtiDescription ?? "")}
              partner2Scores={parseScores(couple.mbti1Description ?? "")}
              detail={couple.mbtiDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.mbti}
              onToggle={() => toggleSectionDetail("mbti")}
            />
          )}
          {couple.disc && couple.disc1 && (
            <AssessmentBlock
              surveyId="SV002"
              title="DISC - Phong cách hành vi"
              icon={<Zap size={20} color="#FFC107" />}
              scoreLabel="80%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={couple.disc ?? ""}
              partner2Code={couple.disc1 ?? ""}
              partner1Scores={parseScores(couple.discDescription ?? "")}
              partner2Scores={parseScores(couple.disc1Description ?? "")}
              detail={couple.discDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.disc}
              onToggle={() => toggleSectionDetail("disc")}
            />
          )}
          {couple.loveLanguage && couple.loveLanguage1 && (
            <AssessmentBlock
              surveyId="SV003"
              title="Love Languages"
              icon={<Heart size={20} color="#E83E8C" />}
              scoreLabel="70%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={couple.loveLanguage ?? ""}
              partner2Code={couple.loveLanguage1 ?? ""}
              partner1Scores={parseScores(couple.loveLanguageDescription ?? "")}
              partner2Scores={parseScores(couple.loveLanguage1Description ?? "")}
              detail={couple.loveLanguageDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.loveLanguage}
              onToggle={() => toggleSectionDetail("loveLanguage")}
            />
          )}
          {couple.bigFive && couple.bigFive1 && (
            <AssessmentBlock
              surveyId="SV004"
              title="Big Five"
              icon={<Star size={20} color="#28A745" />}
              scoreLabel="85%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={couple.bigFive ?? ""}
              partner2Code={couple.bigFive1 ?? ""}
              partner1Scores={parseScores(couple.bigFiveDescription ?? "")}
              partner2Scores={parseScores(couple.bigFive1Description ?? "")}
              detail={couple.bigFiveDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.bigFive}
              onToggle={() => toggleSectionDetail("bigFive")}
            />
          )}
        </View>
       
       {/* Relationship Strengths */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">🌟 Điểm mạnh của mối quan hệ</Text>
          {couple.mbti && couple.mbti1 && (
            <StrengthBlock
              title="MBTI - Điểm mạnh tính cách"
              icon={<Brain size={20} color="#28A745" />}
              data1={parseScores(couple.mbtiDescription ?? "")}
              data2={parseScores(couple.mbti1Description ?? "")}
              threshold={8}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.mbti ?? ""}
              type2={couple.mbti1 ?? ""}
              result={couple.mbtiResult ?? ""}
              expanded={expandedSectionsStrong.mbti}
              onToggle={() => toggleSectionStrong("mbti")}
              strongPoints={couple.mbtiDetail?.strongPoints ?? ""}
            />
          )}
          {couple.disc && couple.disc1 && (
            <StrengthBlock
              title="DISC - Điểm mạnh hành vi"
              icon={<Zap size={20} color="#28A745" />}
              data1={parseScores(couple.discDescription ?? "")}
              data2={parseScores(couple.disc1Description ?? "")}
              threshold={7}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.disc ?? ""}
              type2={couple.disc1 ?? ""}
              result={couple.discResult ?? ""}
              expanded={expandedSectionsStrong.disc}
              onToggle={() => toggleSectionStrong("disc")}
              strongPoints={couple.discDetail?.strongPoints ?? ""}
            />
          )}
          {couple.loveLanguage && couple.loveLanguage1 && (
            <StrengthBlock
              title="Love Language - Điểm mạnh tình yêu"
              icon={<Heart size={20} color="#28A745" />}
              data1={parseScores(couple.loveLanguageDescription ?? "")}
              data2={parseScores(couple.loveLanguage1Description ?? "")}
              threshold={8}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.loveLanguage ?? ""}
              type2={couple.loveLanguage1 ?? ""}
              result={couple.loveLanguageResult ?? ""}
              expanded={expandedSectionsStrong.loveLanguage}
              onToggle={() => toggleSectionStrong("loveLanguage")}
              strongPoints={couple.loveLanguageDetail?.strongPoints ?? ""}
            />
          )}
          {couple.bigFive && couple.bigFive1 && (
            <StrengthBlock
              title="Big Five - Điểm mạnh tính cách"
              icon={<Star size={20} color="#28A745" />}
              data1={parseScores(couple.bigFiveDescription ?? "")}
              data2={parseScores(couple.bigFive1Description ?? "")}
              threshold={7}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.bigFive ?? ""}
              type2={couple.bigFive1 ?? ""}
              result={couple.bigFiveResult ?? ""}
              expanded={expandedSectionsStrong.bigFive}
              onToggle={() => toggleSectionStrong("bigFive")}
              strongPoints={couple.bigFiveDetail?.strongPoints ?? ""}
            />
          )}
        </View>

        {/* Relationship Weaknesses */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">⚠️ Điểm yếu cần cải thiện</Text>
          {couple.mbti && couple.mbti1 && (
            <WeaknessBlock
              title="MBTI - Điểm yếu tính cách"
              icon={<Brain size={20} color="#DC3545" />}
              data1={parseScores(couple.mbtiDescription ?? "")}
              data2={parseScores(couple.mbti1Description ?? "")}
              threshold={5}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.mbti ?? ""}
              type2={couple.mbti1 ?? ""}
              suggestions="• Tăng cường giao tiếp và thấu hiểu lẫn nhau\n• Học cách chấp nhận và bổ trợ cho nhau\n• Phát triển các kỹ năng còn yếu thông qua thực hành"
              expanded={expandedSectionsWeak.mbti}
              onToggle={() => toggleSectionWeak("mbti")}
              weaknesses={couple.mbtiDetail?.weaknesses ?? ""}
            />
          )}
          {couple.disc && couple.disc1 && (
            <WeaknessBlock
              title="DISC - Điểm yếu hành vi"
              icon={<Zap size={20} color="#DC3545" />}
              data1={parseScores(couple.discDescription ?? "")}
              data2={parseScores(couple.disc1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.disc ?? ""}
              type2={couple.disc1 ?? ""}
              suggestions="• Nhận biết và điều chỉnh phong cách giao tiếp\n• Học cách thích ứng với phong cách của đối phương\n• Phát triển các kỹ năng hành vi còn thiếu"
              expanded={expandedSectionsWeak.disc}
              onToggle={() => toggleSectionWeak("disc")}
              weaknesses={couple.discDetail?.weaknesses ?? ""}
            />
          )}
          {couple.loveLanguage && couple.loveLanguage1 && (
            <WeaknessBlock
              title="Love Language - Điểm yếu tình yêu"
              icon={<Heart size={20} color="#DC3545" />}
              data1={parseScores(couple.loveLanguageDescription ?? "")}
              data2={parseScores(couple.loveLanguage1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.loveLanguage ?? ""}
              type2={couple.loveLanguage1 ?? ""}
              suggestions="• Học cách thể hiện tình yêu theo ngôn ngữ của đối phương\n• Phát triển các ngôn ngữ tình yêu còn yếu\n• Tăng cường giao tiếp về nhu cầu tình cảm"
              expanded={expandedSectionsWeak.loveLanguage}
              onToggle={() => toggleSectionWeak("loveLanguage")}
              weaknesses={couple.loveLanguageDetail?.weaknesses ?? ""}
            />
          )}
          {couple.bigFive && couple.bigFive1 && (
            <WeaknessBlock
              title="Big Five - Điểm yếu tính cách"
              icon={<Star size={20} color="#DC3545" />}
              data1={parseScores(couple.bigFiveDescription ?? "")}
              data2={parseScores(couple.bigFive1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={couple.bigFive ?? ""}
              type2={couple.bigFive1 ?? ""}
              suggestions="• Nhận thức và phát triển các yếu tố tính cách còn yếu\n• Tạo môi trường hỗ trợ lẫn nhau trong phát triển\n• Thực hành các hoạt động giúp cải thiện tính cách"
              expanded={expandedSectionsWeak.bigFive}
              onToggle={() => toggleSectionWeak("bigFive")}
              weaknesses={couple.bigFiveDetail?.weaknesses ?? ""}
            />
          )}
        </View>
        
      </View>
      <LoveMapPersonModal
        visible={showPersonDetail}
        onClose={() => setShowPersonDetail(false)}
        personKey={selectedPerson || "member"}
        coupleData={couple}
        parseScores={parseScores}
      />
    </View>
  )
}

export default LoveMapContent