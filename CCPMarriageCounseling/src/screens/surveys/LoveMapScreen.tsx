"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  Heart,
  Brain,
  Zap,
  Star,
  Share2,
  Download,
} from "lucide-react-native"

import CompatibilityScore from "../../components/lovemap/CompatibilityScore"
import AssessmentBlock from "../../components/lovemap/AssessmentBlock"
import StrengthBlock from "../../components/lovemap/StrengthBlock"
import WeaknessBlock from "../../components/lovemap/WeaknessBlock"
import CounselorRecommendation from "../../components/lovemap/CounselorRecommendation"
import LoveMapPersonModal from "../../components/lovemap/LoveMapPersonModal"
import { useAuth } from "../../hooks/useAuth"
import coupleApi from "../../config/api/couple.api"
import type { Couple } from "../../config/types/couple.type"
import Loading from "@/src/components/share/Loading"
import CounselorRecommendList from "@/src/components/counselor/CounselorRecommendList"

interface RouteParams {
  coupleId: string
}

const LoveMapScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { coupleId } = route.params as RouteParams
  const { user } = useAuth()

  const [coupleData, setCoupleData] = useState<Couple | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPersonDetail, setShowPersonDetail] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<"member" | "member1" | null>(null)

  // Expanded sections state
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
  }, [coupleId])

  const loadCoupleResult = async () => {
    try {
      setLoading(true)
      const result = await coupleApi.getCoupleResult(coupleId)
      setCoupleData(result)
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải kết quả bản đồ tình yêu")
      navigation.goBack()
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

  const handleShare = () => {
    Alert.alert("Chia sẻ", "Tính năng chia sẻ sẽ được cập nhật sớm")
  }

  const handleDownload = () => {
    Alert.alert("Tải xuống", "Tính năng tải xuống sẽ được cập nhật sớm")
  }

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

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Loading size={60} />
        <Text className="text-secondary mt-4">Đang tải bản đồ tình yêu...</Text>
      </View>
    )
  }

  if (!coupleData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
          <Heart size={64} color="#E83E8C" className="mb-4" />
          <Text className="text-2xl font-bold text-secondary-dark mb-2 text-center">Không tìm thấy dữ liệu</Text>
          <Text className="text-secondary text-center mb-6">
            Không thể tải thông tin bản đồ tình yêu. Vui lòng thử lại sau.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="bg-primary rounded-xl px-6 py-3">
            <Text className="text-white font-bold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const partner1 = coupleData.member
  const partner2Name = coupleData.isVirtual
    ? (coupleData.virtualName ?? "Đối tác ảo")
    : (coupleData.member1?.fullname ?? "Đối tác ảo")
  const partner2Avatar = coupleData.isVirtual
    ? (coupleData.virtualAvatar ?? undefined)
    : (coupleData.member1?.avatar ?? undefined)

  const overallCompatibility = calculateOverallCompatibility(coupleData)

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary p-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Bản đồ tình yêu</Text>
            <Text className="text-white/90">Phân tích tổng hợp mối quan hệ</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={handleShare} className="bg-white/20 rounded-full p-2">
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload} className="bg-white/20 rounded-full p-2">
              <Download size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 -mt-4" showsVerticalScrollIndicator={false}>
        {/* Overall Compatibility */}
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
          mbti1={coupleData.mbti ?? ""}
          mbti2={coupleData.mbti1 ?? ""}
          onPressPerson={handlePersonDetail}

        />

        {/* Assessment Breakdown */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Chi tiết đánh giá</Text>
          {coupleData.mbti && coupleData.mbti1 && (
            <AssessmentBlock
              surveyId="SV001"
              title="MBTI - Tính cách"
              icon={<Brain size={20} color="#E83E8C" />}
              scoreLabel="75%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={coupleData.mbti ?? ""}
              partner2Code={coupleData.mbti1 ?? ""}
              partner1Scores={parseScores(coupleData.mbtiDescription ?? "")}
              partner2Scores={parseScores(coupleData.mbti1Description ?? "")}
              detail={coupleData.mbtiDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.mbti}
              onToggle={() => toggleSectionDetail("mbti")}
            />
          )}
          {coupleData.disc && coupleData.disc1 && (
            <AssessmentBlock
              surveyId="SV002"
              title="DISC - Phong cách hành vi"
              icon={<Zap size={20} color="#FFC107" />}
              scoreLabel="80%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={coupleData.disc ?? ""}
              partner2Code={coupleData.disc1 ?? ""}
              partner1Scores={parseScores(coupleData.discDescription ?? "")}
              partner2Scores={parseScores(coupleData.disc1Description ?? "")}
              detail={coupleData.discDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.disc}
              onToggle={() => toggleSectionDetail("disc")}
            />
          )}
          {coupleData.loveLanguage && coupleData.loveLanguage1 && (
            <AssessmentBlock
              surveyId="SV003"
              title="Love Languages"
              icon={<Heart size={20} color="#E83E8C" />}
              scoreLabel="70%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={coupleData.loveLanguage ?? ""}
              partner2Code={coupleData.loveLanguage1 ?? ""}
              partner1Scores={parseScores(coupleData.loveLanguageDescription ?? "")}
              partner2Scores={parseScores(coupleData.loveLanguage1Description ?? "")}
              detail={coupleData.loveLanguageDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.loveLanguage}
              onToggle={() => toggleSectionDetail("loveLanguage")}
            />
          )}
          {coupleData.bigFive && coupleData.bigFive1 && (
            <AssessmentBlock
              surveyId="SV004"
              title="Big Five"
              icon={<Star size={20} color="#28A745" />}
              scoreLabel="85%"
              partner1Name={partner1.fullname ?? "Đối tác 1"}
              partner2Name={partner2Name}
              partner1Code={coupleData.bigFive ?? ""}
              partner2Code={coupleData.bigFive1 ?? ""}
              partner1Scores={parseScores(coupleData.bigFiveDescription ?? "")}
              partner2Scores={parseScores(coupleData.bigFive1Description ?? "")}
              detail={coupleData.bigFiveDetail?.detail ?? ""}
              expanded={expandedSectionsDetail.bigFive}
              onToggle={() => toggleSectionDetail("bigFive")}
            />
          )}
        </View>

        {/* Relationship Strengths */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">🌟 Điểm mạnh của mối quan hệ</Text>
          {coupleData.mbti && coupleData.mbti1 && (
            <StrengthBlock
              title="MBTI - Điểm mạnh tính cách"
              icon={<Brain size={20} color="#28A745" />}
              data1={parseScores(coupleData.mbtiDescription ?? "")}
              data2={parseScores(coupleData.mbti1Description ?? "")}
              threshold={8}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.mbti ?? ""}
              type2={coupleData.mbti1 ?? ""}
              result={coupleData.mbtiResult ?? ""}
              expanded={expandedSectionsStrong.mbti}
              onToggle={() => toggleSectionStrong("mbti")}
              strongPoints={coupleData.mbtiDetail?.strongPoints ?? ""}
            />
          )}
          {coupleData.disc && coupleData.disc1 && (
            <StrengthBlock
              title="DISC - Điểm mạnh hành vi"
              icon={<Zap size={20} color="#28A745" />}
              data1={parseScores(coupleData.discDescription ?? "")}
              data2={parseScores(coupleData.disc1Description ?? "")}
              threshold={7}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.disc ?? ""}
              type2={coupleData.disc1 ?? ""}
              result={coupleData.discResult ?? ""}
              expanded={expandedSectionsStrong.disc}
              onToggle={() => toggleSectionStrong("disc")}
              strongPoints={coupleData.discDetail?.strongPoints ?? ""}
            />
          )}
          {coupleData.loveLanguage && coupleData.loveLanguage1 && (
            <StrengthBlock
              title="Love Language - Điểm mạnh tình yêu"
              icon={<Heart size={20} color="#28A745" />}
              data1={parseScores(coupleData.loveLanguageDescription ?? "")}
              data2={parseScores(coupleData.loveLanguage1Description ?? "")}
              threshold={8}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.loveLanguage ?? ""}
              type2={coupleData.loveLanguage1 ?? ""}
              result={coupleData.loveLanguageResult ?? ""}
              expanded={expandedSectionsStrong.loveLanguage}
              onToggle={() => toggleSectionStrong("loveLanguage")}
              strongPoints={coupleData.loveLanguageDetail?.strongPoints ?? ""}
            />
          )}
          {coupleData.bigFive && coupleData.bigFive1 && (
            <StrengthBlock
              title="Big Five - Điểm mạnh tính cách"
              icon={<Star size={20} color="#28A745" />}
              data1={parseScores(coupleData.bigFiveDescription ?? "")}
              data2={parseScores(coupleData.bigFive1Description ?? "")}
              threshold={7}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.bigFive ?? ""}
              type2={coupleData.bigFive1 ?? ""}
              result={coupleData.bigFiveResult ?? ""}
              expanded={expandedSectionsStrong.bigFive}
              onToggle={() => toggleSectionStrong("bigFive")}
              strongPoints={coupleData.bigFiveDetail?.strongPoints ?? ""}
            />
          )}
        </View>

        {/* Relationship Weaknesses */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">⚠️ Điểm yếu cần cải thiện</Text>
          {coupleData.mbti && coupleData.mbti1 && (
            <WeaknessBlock
              title="MBTI - Điểm yếu tính cách"
              icon={<Brain size={20} color="#DC3545" />}
              data1={parseScores(coupleData.mbtiDescription ?? "")}
              data2={parseScores(coupleData.mbti1Description ?? "")}
              threshold={5}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.mbti ?? ""}
              type2={coupleData.mbti1 ?? ""}
              suggestions="• Tăng cường giao tiếp và thấu hiểu lẫn nhau\n• Học cách chấp nhận và bổ trợ cho nhau\n• Phát triển các kỹ năng còn yếu thông qua thực hành"
              expanded={expandedSectionsWeak.mbti}
              onToggle={() => toggleSectionWeak("mbti")}
              weaknesses={coupleData.mbtiDetail?.weaknesses ?? ""}
            />
          )}
          {coupleData.disc && coupleData.disc1 && (
            <WeaknessBlock
              title="DISC - Điểm yếu hành vi"
              icon={<Zap size={20} color="#DC3545" />}
              data1={parseScores(coupleData.discDescription ?? "")}
              data2={parseScores(coupleData.disc1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.disc ?? ""}
              type2={coupleData.disc1 ?? ""}
              suggestions="• Nhận biết và điều chỉnh phong cách giao tiếp\n• Học cách thích ứng với phong cách của đối phương\n• Phát triển các kỹ năng hành vi còn thiếu"
              expanded={expandedSectionsWeak.disc}
              onToggle={() => toggleSectionWeak("disc")}
              weaknesses={coupleData.discDetail?.weaknesses ?? ""}
            />
          )}
          {coupleData.loveLanguage && coupleData.loveLanguage1 && (
            <WeaknessBlock
              title="Love Language - Điểm yếu tình yêu"
              icon={<Heart size={20} color="#DC3545" />}
              data1={parseScores(coupleData.loveLanguageDescription ?? "")}
              data2={parseScores(coupleData.loveLanguage1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.loveLanguage ?? ""}
              type2={coupleData.loveLanguage1 ?? ""}
              suggestions="• Học cách thể hiện tình yêu theo ngôn ngữ của đối phương\n• Phát triển các ngôn ngữ tình yêu còn yếu\n• Tăng cường giao tiếp về nhu cầu tình cảm"
              expanded={expandedSectionsWeak.loveLanguage}
              onToggle={() => toggleSectionWeak("loveLanguage")}
              weaknesses={coupleData.loveLanguageDetail?.weaknesses ?? ""}
            />
          )}
          {coupleData.bigFive && coupleData.bigFive1 && (
            <WeaknessBlock
              title="Big Five - Điểm yếu tính cách"
              icon={<Star size={20} color="#DC3545" />}
              data1={parseScores(coupleData.bigFiveDescription ?? "")}
              data2={parseScores(coupleData.bigFive1Description ?? "")}
              threshold={4}
              name1={partner1.fullname ?? "Đối tác 1"}
              name2={partner2Name}
              type1={coupleData.bigFive ?? ""}
              type2={coupleData.bigFive1 ?? ""}
              suggestions="• Nhận thức và phát triển các yếu tố tính cách còn yếu\n• Tạo môi trường hỗ trợ lẫn nhau trong phát triển\n• Thực hành các hoạt động giúp cải thiện tính cách"
              expanded={expandedSectionsWeak.bigFive}
              onToggle={() => toggleSectionWeak("bigFive")}
              weaknesses={coupleData.bigFiveDetail?.weaknesses ?? ""}
            />
          )}
        </View>

        {/* Counselor Recommendations */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Lời khuyên từ tư vấn viên</Text>
          <CounselorRecommendation
            rec1={coupleData.rec1 ?? ""}
            rec2={coupleData.rec2 ?? ""}
            onRegister={() => navigation.navigate("CounselorsTab")}
          />
          <CounselorRecommendList />
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate("SurveyTab", { screen: "SurveyList" })}
            className="bg-primary rounded-xl p-4 mb-3"
          >
            <Text className="text-white font-bold text-center">Làm khảo sát mới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("CoursesTab")}
            className="bg-white border border-primary rounded-xl p-4"
          >
            <Text className="text-primary font-bold text-center">Khám phá khóa học phù hợp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Person Detail Modal */}
      <LoveMapPersonModal
        visible={showPersonDetail}
        onClose={() => setShowPersonDetail(false)}
        personKey={selectedPerson || "member"}
        coupleData={coupleData}
        parseScores={parseScores}
      />
    </View>
  )
}

export default LoveMapScreen