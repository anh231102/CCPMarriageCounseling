// 🔗 Giữ nguyên phần import và interface như cũ
import { View, Text, ScrollView, Share as RNShare } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Heart, Award, Brain, Zap, Star } from "lucide-react-native"
import CustomButton from "../../components/CustomButton"
import ComparisonChart from "@/src/components/survey/ComparisonChart"

interface SurveyAnswer {
  user: string | number
  partner: string | number
}

interface SurveyResults {
  surveyType: string
  answers: Record<string, SurveyAnswer>
  userData: {
    name: string
    partnerName: string
  }
}

const SurveyResultsScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { results, isAuthenticated } = route.params as {
    results: SurveyResults
    isAuthenticated: boolean
  }

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Tôi vừa hoàn thành bộ khảo sát tổng hợp tính cách & mối quan hệ trên ứng dụng Tư vấn hôn nhân. Hãy thử ngay!`,
      })
    } catch (error) {
      console.log(error)
    }
  }

  // ✅ Đã giữ nguyên cách tách câu trả lời
  const getMBTIAnswers = () => Object.fromEntries(Object.entries(results.answers).filter(([key]) => key.startsWith("mbti_")))
  const getDISCAnswers = () => Object.fromEntries(Object.entries(results.answers).filter(([key]) => key.startsWith("disc_")))
  const getLoveLanguageAnswers = () => Object.fromEntries(Object.entries(results.answers).filter(([key]) => key.startsWith("love_")))
  const getBigFiveAnswers = () => Object.fromEntries(Object.entries(results.answers).filter(([key]) => key.startsWith("big5_")))

  const renderMBTIResults = () => {
    const mbtiAnswers = getMBTIAnswers()
    const userAnswers = Object.values(mbtiAnswers).map((a) => (a as SurveyAnswer).user as string)
    const partnerAnswers = Object.values(mbtiAnswers).map((a) => (a as SurveyAnswer).partner as string)

    const calculateType = (answers: string[]) => {
      const type = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      answers.forEach((answer) => {
        type[answer as keyof typeof type]++
      })
      return [
        type.E > type.I ? "E" : "I",
        type.S > type.N ? "S" : "N",
        type.T > type.F ? "T" : "F",
        type.J > type.P ? "J" : "P",
      ].join("")
    }

    const userType = calculateType(userAnswers)
    const partnerType = calculateType(partnerAnswers)

    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-primary/10 rounded-full p-3 mr-3">
            <Brain size={24} color="#E83E8C" />
          </View>
          <Text className="text-xl font-bold text-secondary-dark">MBTI - Myers-Briggs</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="items-center flex-1">
            <Text className="text-secondary text-sm mb-2">{results.userData.name || "Bạn"}</Text>
            <View className="bg-primary/10 rounded-xl px-4 py-3">
              <Text className="text-2xl font-bold text-primary text-center">{userType}</Text>
            </View>
          </View>

          <View className="mx-4">
            <Heart size={20} color="#E83E8C" />
          </View>

          <View className="items-center flex-1">
            <Text className="text-secondary text-sm mb-2">{results.userData.partnerName || "Đối tác"}</Text>
            <View className="bg-secondary/10 rounded-xl px-4 py-3">
              <Text className="text-2xl font-bold text-secondary text-center">{partnerType}</Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4">
          <Text className="text-secondary-dark font-medium mb-2">Phân tích tương thích</Text>
          <Text className="text-secondary text-sm">
            {userType === partnerType
              ? `Cả hai đều có tính cách ${userType}. Điều này tạo ra sự hiểu biết sâu sắc nhưng cũng cần cân bằng.`
              : `${userType} và ${partnerType} có những điểm khác biệt thú vị, tạo cơ hội học hỏi lẫn nhau.`}
          </Text>
        </View>
      </View>
    )
  }

  const renderDISCResults = () => {
    const discAnswers = getDISCAnswers()
    const userAnswers = Object.values(discAnswers).map((a) => (a as SurveyAnswer).user as string)
    const partnerAnswers = Object.values(discAnswers).map((a) => (a as SurveyAnswer).partner as string)

    const calculateDISCProfile = (answers: string[]) => {
      const profile = { D: 0, I: 0, S: 0, C: 0 }
      answers.forEach((answer) => {
        profile[answer as keyof typeof profile]++
      })

      let maxScore = 0
      let dominantStyle = ""
      Object.entries(profile).forEach(([style, score]) => {
        if (score > maxScore) {
          maxScore = score
          dominantStyle = style
        }
      })

      const styleNames = {
        D: "Dominance (Quyết đoán)",
        I: "Influence (Ảnh hưởng)",
        S: "Steadiness (Ổn định)",
        C: "Conscientiousness (Tỉ mỉ)",
      }

      return {
        profile,
        dominantStyle,
        styleName: styleNames[dominantStyle as keyof typeof styleNames],
      }
    }

    const userProfile = calculateDISCProfile(userAnswers)
    const partnerProfile = calculateDISCProfile(partnerAnswers)

    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-warning/10 rounded-full p-3 mr-3">
            <Zap size={24} color="#FFC107" />
          </View>
          <Text className="text-xl font-bold text-secondary-dark">DISC - Phong cách hành vi</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="items-center flex-1">
            <Text className="text-secondary text-sm mb-2">{results.userData.name || "Bạn"}</Text>
            <View className="bg-warning/10 rounded-xl px-3 py-2">
              <Text className="text-xl font-bold text-warning text-center">{userProfile.dominantStyle}</Text>
            </View>
            <Text className="text-xs text-secondary text-center mt-1">{userProfile.styleName}</Text>
          </View>

          <View className="mx-4">
            <Heart size={20} color="#E83E8C" />
          </View>

          <View className="items-center flex-1">
            <Text className="text-secondary text-sm mb-2">{results.userData.partnerName || "Đối tác"}</Text>
            <View className="bg-info/10 rounded-xl px-3 py-2">
              <Text className="text-xl font-bold text-info text-center">{partnerProfile.dominantStyle}</Text>
            </View>
            <Text className="text-xs text-secondary text-center mt-1">{partnerProfile.styleName}</Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4">
          <Text className="text-secondary-dark font-medium mb-2">Phân tích phong cách làm việc</Text>
          <Text className="text-secondary text-sm">
            {userProfile.dominantStyle === partnerProfile.dominantStyle
              ? `Cả hai đều có phong cách ${userProfile.styleName}. Điều này giúp hiểu nhau nhưng cần đa dạng hóa cách tiếp cận.`
              : `Sự kết hợp giữa ${userProfile.styleName} và ${partnerProfile.styleName} tạo ra sự cân bằng tốt trong mối quan hệ.`}
          </Text>
        </View>
      </View>
    )
  }

  const renderLoveLanguageResults = () => {
    const loveAnswers = getLoveLanguageAnswers()
    const userAnswers = Object.values(loveAnswers).map((a) => (a as SurveyAnswer).user as number)
    const partnerAnswers = Object.values(loveAnswers).map((a) => (a as SurveyAnswer).partner as number)

    const languages = ["Thời gian chất lượng", "Lời nói khẳng định", "Quà tặng", "Hành động phục vụ", "Tiếp xúc cơ thể"]

    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-primary/10 rounded-full p-3 mr-3">
            <Heart size={24} color="#E83E8C" />
          </View>
          <Text className="text-xl font-bold text-secondary-dark">Love Languages - Ngôn ngữ tình yêu</Text>
        </View>

        {languages.map((lang, index) => (
          <ComparisonChart
            key={lang}
            title={lang}
            userScore={userAnswers[index]}
            partnerScore={partnerAnswers[index]}
            userName={results.userData.name || "Bạn"}
            partnerName={results.userData.partnerName || "Đối tác"}
            maxScore={5}
          />
        ))}
      </View>
    )
  }

  const renderBigFiveResults = () => {
    const bigFiveAnswers = getBigFiveAnswers()
    const userAnswers = Object.values(bigFiveAnswers).map((a) => (a as SurveyAnswer).user as number)
    const partnerAnswers = Object.values(bigFiveAnswers).map((a) => (a as SurveyAnswer).partner as number)

    const factors = [
      "Openness (Cởi mở)",
      "Conscientiousness (Tận tâm)",
      "Extraversion (Hướng ngoại)",
      "Agreeableness (Dễ chịu)",
      "Neuroticism (Bất ổn cảm xúc)",
    ]

    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="bg-success/10 rounded-full p-3 mr-3">
            <Star size={24} color="#28A745" />
          </View>
          <Text className="text-xl font-bold text-secondary-dark">Big Five - Năm yếu tố tính cách</Text>
        </View>

        {factors.map((factor, index) => (
          <ComparisonChart
            key={factor}
            title={factor}
            userScore={userAnswers[index]}
            partnerScore={partnerAnswers[index]}
            userName={results.userData.name || "Bạn"}
            partnerName={results.userData.partnerName || "Đối tác"}
            maxScore={5}
          />
        ))}
      </View>
    )
  }

  const calculateOverallCompatibility = () => {
    // Không đổi phần logic – chỉ ép kiểu rõ ràng
    const userMBTI = Object.values(getMBTIAnswers()).map((a) => (a as SurveyAnswer).user as string)
    const partnerMBTI = Object.values(getMBTIAnswers()).map((a) => (a as SurveyAnswer).partner as string)
    const mbtiScore = userMBTI.reduce((acc, curr, i) => acc + (curr === partnerMBTI[i] ? 1 : 0), 0)
    const mbtiCompatibility = (mbtiScore / userMBTI.length) * 25

    const userDISC = Object.values(getDISCAnswers()).map((a) => (a as SurveyAnswer).user as string)
    const partnerDISC = Object.values(getDISCAnswers()).map((a) => (a as SurveyAnswer).partner as string)
    const discScore = userDISC.reduce((acc, curr, i) => acc + (curr === partnerDISC[i] ? 1 : 0), 0)
    const discCompatibility = (discScore / userDISC.length) * 25

    const userLove = Object.values(getLoveLanguageAnswers()).map((a) => (a as SurveyAnswer).user as number)
    const partnerLove = Object.values(getLoveLanguageAnswers()).map((a) => (a as SurveyAnswer).partner as number)
    const loveScore = userLove.reduce((acc, curr, i) => acc + Math.max(0, 5 - Math.abs(curr - partnerLove[i])) / 5, 0)
    const loveCompatibility = (loveScore / userLove.length) * 25

    const userBigFive = Object.values(getBigFiveAnswers()).map((a) => (a as SurveyAnswer).user as number)
    const partnerBigFive = Object.values(getBigFiveAnswers()).map((a) => (a as SurveyAnswer).partner as number)
    const bigFiveScore = userBigFive.reduce((acc, curr, i) => acc + Math.max(0, 5 - Math.abs(curr - partnerBigFive[i])) / 5, 0)
    const bigFiveCompatibility = (bigFiveScore / userBigFive.length) * 25

    return Math.round(mbtiCompatibility + discCompatibility + loveCompatibility + bigFiveCompatibility)
  }

  const overallCompatibility = calculateOverallCompatibility()

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
          <View className="items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Award size={32} color="#E83E8C" />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">Kết quả tổng hợp</Text>
            <Text className="text-secondary text-center">Phân tích toàn diện tính cách & mối quan hệ</Text>
          </View>

          {/* Overall Compatibility */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-secondary-dark font-medium mb-2 text-center">Điểm tương thích tổng hợp</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-2">
              <View
                className={`h-full rounded-full ${
                  overallCompatibility >= 75
                    ? "bg-success"
                    : overallCompatibility >= 50
                      ? "bg-primary"
                      : overallCompatibility >= 25
                        ? "bg-warning"
                        : "bg-danger"
                }`}
                style={{ width: `${overallCompatibility}%` }}
              />
            </View>
            <Text
              className={`text-center font-bold text-2xl ${
                overallCompatibility >= 75
                  ? "text-success"
                  : overallCompatibility >= 50
                    ? "text-primary"
                    : overallCompatibility >= 25
                      ? "text-warning"
                      : "text-danger"
              }`}
            >
              {overallCompatibility}%
            </Text>
          </View>
        </View>

        {/* Individual Results */}
        {renderMBTIResults()}
        {renderDISCResults()}
        {renderLoveLanguageResults()}
        {renderBigFiveResults()}

        {!isAuthenticated && (
          <View className="bg-primary/10 rounded-xl p-5 mb-6">
            <Text className="text-primary font-bold text-lg mb-2">Lưu kết quả của bạn</Text>
            <Text className="text-secondary-dark mb-4">
              Đăng ký tài khoản để lưu lại kết quả và xem bản đồ tình yêu chi tiết.
            </Text>
            <CustomButton onPress={() => navigation.navigate("Auth", { screen: "Register" })} className="bg-primary">
              <Text className="text-white font-medium text-center">Đăng ký ngay</Text>
            </CustomButton>
          </View>
        )}

        <View className="mb-6">
          <CustomButton onPress={() => navigation.navigate("SurveyList")} variant="outline" className="mb-4">
            <Text className="text-primary font-medium text-center">Làm lại khảo sát</Text>
          </CustomButton>

          {isAuthenticated && (
            <CustomButton onPress={() => navigation.navigate("LoveMap")} variant="solid">
              <Text className="text-white font-medium text-center">Xem bản đồ tình yêu chi tiết</Text>
            </CustomButton>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default SurveyResultsScreen
