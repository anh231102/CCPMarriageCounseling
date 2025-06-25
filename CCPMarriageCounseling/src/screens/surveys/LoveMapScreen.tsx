"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Heart, Award, TrendingUp, Star, Brain, Zap, Share2, Download } from "lucide-react-native"

import ComparisonChart from "@/src/components/survey/ComparisonChart"
import { useAuth } from "../../hooks/useAuth"

const LoveMapScreen = () => {
  const navigation = useNavigation<any>()
  const { isAuth, user } = useAuth()

  // Giả lập dữ liệu kết quả từ khảo sát tổng hợp
  const loveMapData = {
    isCompleted: true, // Đã hoàn thành cả 4 bài test
    completedDate: "2024-01-15",
    userData: {
      name: "Nguyễn Văn A",
      partnerName: "Nguyễn Thị B",
    },
    overallCompatibility: 78, // Điểm tương thích tổng hợp từ 4 bài test

    // Kết quả MBTI
    mbti: {
      userType: "ENFJ",
      partnerType: "ISTP",
      compatibility: 65,
      analysis:
        "Sự kết hợp giữa ENFJ và ISTP tạo ra những thách thức thú vị. ENFJ hướng ngoại và tập trung vào cảm xúc, trong khi ISTP hướng nội và logic. Điều này có thể tạo ra sự cân bằng tốt nếu cả hai hiểu và tôn trọng lẫn nhau.",
    },

    // Kết quả DISC
    disc: {
      userStyle: "I", // Influence
      partnerStyle: "S", // Steadiness
      compatibility: 82,
      analysis:
        "Phong cách Influence (I) và Steadiness (S) bổ sung rất tốt cho nhau. Người I mang lại năng lượng và sự nhiệt tình, trong khi người S cung cấp sự ổn định và hỗ trợ.",
    },

    // Kết quả Love Languages
    loveLanguages: {
      userPrimary: "Lời nói khẳng định",
      partnerPrimary: "Hành động phục vụ",
      compatibility: 70,
      scores: {
        user: [4, 5, 2, 3, 3], // [time, words, gifts, acts, touch]
        partner: [3, 2, 3, 5, 4],
      },
    },

    // Kết quả Big Five
    bigFive: {
      compatibility: 85,
      factors: [
        { name: "Openness", user: 4, partner: 3, compatibility: 75 },
        { name: "Conscientiousness", user: 3, partner: 4, compatibility: 85 },
        { name: "Extraversion", user: 5, partner: 2, compatibility: 60 },
        { name: "Agreeableness", user: 4, partner: 4, compatibility: 95 },
        { name: "Neuroticism", user: 2, partner: 3, compatibility: 80 },
      ],
    },

    // Điểm mạnh của mối quan hệ
    strengths: [
      {
        title: "Giao tiếp cảm xúc",
        score: 85,
        description: "Cả hai đều có khả năng chia sẻ cảm xúc và lắng nghe nhau một cách hiệu quả.",
      },
      {
        title: "Hỗ trợ lẫn nhau",
        score: 90,
        description: "Sự kết hợp giữa tính nhiệt tình và ổn định tạo ra môi trường hỗ trợ tuyệt vời.",
      },
      {
        title: "Tôn trọng khác biệt",
        score: 75,
        description: "Cả hai đều thể hiện sự tôn trọng và chấp nhận những khác biệt của nhau.",
      },
    ],

    // Khu vực cần cải thiện
    improvements: [
      {
        title: "Cân bằng năng lượng xã hội",
        priority: "Cao",
        description: "Cần tìm cách cân bằng giữa nhu cầu giao tiếp xã hội và thời gian riêng tư.",
        suggestions: [
          "Lên kế hoạch hoạt động xã hội phù hợp với cả hai",
          "Tôn trọng nhu cầu thời gian riêng của nhau",
          "Thảo luận trước về các sự kiện xã hội",
        ],
      },
      {
        title: "Thể hiện tình yêu",
        priority: "Trung bình",
        description: "Học cách thể hiện tình yêu theo ngôn ngữ tình yêu của đối tác.",
        suggestions: [
          "Thường xuyên khen ngợi và khẳng định đối tác",
          "Thể hiện tình yêu qua hành động cụ thể",
          "Dành thời gian chất lượng cho nhau",
        ],
      },
    ],

    // Lời khuyên cá nhân hóa
    recommendations: [
      {
        category: "Giao tiếp",
        advice: "Hãy tận dụng khả năng giao tiếp tự nhiên của ENFJ để tạo không gian an toàn cho ISTP chia sẻ.",
      },
      {
        category: "Xung đột",
        advice: "Khi có xung đột, hãy cho nhau thời gian suy nghĩ trước khi thảo luận giải pháp.",
      },
      {
        category: "Tình yêu",
        advice: "Thể hiện tình yêu qua hành động cụ thể và lời nói khẳng định để cả hai đều cảm thấy được yêu thương.",
      },
    ],
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-primary"
    if (score >= 40) return "text-warning"
    return "text-danger"
  }

  const getCompatibilityBg = (score: number) => {
    if (score >= 80) return "bg-success"
    if (score >= 60) return "bg-primary"
    if (score >= 40) return "bg-warning"
    return "bg-danger"
  }

  const handleShare = () => {
    // Logic chia sẻ kết quả
  }

  const handleDownload = () => {
    // Logic tải xuống báo cáo
  }

  if (!loveMapData.isCompleted) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
          <Heart size={64} color="#E83E8C" className="mb-4" />
          <Text className="text-2xl font-bold text-secondary-dark mb-2 text-center">Chưa có bản đồ tình yêu</Text>
          <Text className="text-secondary text-center mb-6">
            Bạn cần hoàn thành bộ khảo sát tổng hợp để xem bản đồ tình yêu chi tiết.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SurveyList")}
            className="bg-primary rounded-xl px-6 py-3"
          >
            <Text className="text-white font-bold">Bắt đầu khảo sát</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

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
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-6">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Award size={32} color="#E83E8C" />
            </View>
            <Text className="text-2xl font-bold text-secondary-dark text-center">Điểm tương thích tổng hợp</Text>
            <Text className="text-secondary text-center">Dựa trên 4 bài đánh giá tính cách</Text>
          </View>

          <View className="items-center mb-6">
            <View className="relative w-32 h-32 items-center justify-center">
              <View className="absolute w-full h-full rounded-full border-8 border-gray-200" />
              <View
                className={`absolute w-full h-full rounded-full border-8 ${getCompatibilityBg(loveMapData.overallCompatibility)}`}
                style={{
                  transform: [{ rotate: `${(loveMapData.overallCompatibility / 100) * 360}deg` }],
                }}
              />
              <Text className={`text-3xl font-bold ${getCompatibilityColor(loveMapData.overallCompatibility)}`}>
                {loveMapData.overallCompatibility}%
              </Text>
            </View>
            <Text className="text-secondary-dark font-medium mt-2">
              {loveMapData.overallCompatibility >= 80
                ? "Rất tương thích"
                : loveMapData.overallCompatibility >= 60
                  ? "Tương thích tốt"
                  : loveMapData.overallCompatibility >= 40
                    ? "Tương thích trung bình"
                    : "Cần cải thiện"}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-secondary text-sm">{loveMapData.userData.name}</Text>
              <View className="bg-primary/10 rounded-lg px-3 py-2 mt-1">
                <Text className="text-primary font-bold">{loveMapData.mbti.userType}</Text>
              </View>
            </View>
            <View className="items-center mx-4">
              <Heart size={24} color="#E83E8C" />
            </View>
            <View className="items-center flex-1">
              <Text className="text-secondary text-sm">{loveMapData.userData.partnerName}</Text>
              <View className="bg-secondary/10 rounded-lg px-3 py-2 mt-1">
                <Text className="text-secondary font-bold">{loveMapData.mbti.partnerType}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Assessment Breakdown */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Chi tiết đánh giá</Text>

          {/* MBTI */}
          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
            <View className="flex-row items-center flex-1">
              <View className="bg-primary/10 rounded-full p-2 mr-3">
                <Brain size={20} color="#E83E8C" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">MBTI - Tính cách</Text>
                <Text className="text-secondary text-sm">
                  {loveMapData.mbti.userType} × {loveMapData.mbti.partnerType}
                </Text>
              </View>
            </View>
            <Text className={`font-bold ${getCompatibilityColor(loveMapData.mbti.compatibility)}`}>
              {loveMapData.mbti.compatibility}%
            </Text>
          </View>

          {/* DISC */}
          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
            <View className="flex-row items-center flex-1">
              <View className="bg-warning/10 rounded-full p-2 mr-3">
                <Zap size={20} color="#FFC107" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">DISC - Phong cách hành vi</Text>
                <Text className="text-secondary text-sm">
                  {loveMapData.disc.userStyle} × {loveMapData.disc.partnerStyle}
                </Text>
              </View>
            </View>
            <Text className={`font-bold ${getCompatibilityColor(loveMapData.disc.compatibility)}`}>
              {loveMapData.disc.compatibility}%
            </Text>
          </View>

          {/* Love Languages */}
          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
            <View className="flex-row items-center flex-1">
              <View className="bg-primary/10 rounded-full p-2 mr-3">
                <Heart size={20} color="#E83E8C" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">Love Languages</Text>
                <Text className="text-secondary text-sm">Ngôn ngữ tình yêu</Text>
              </View>
            </View>
            <Text className={`font-bold ${getCompatibilityColor(loveMapData.loveLanguages.compatibility)}`}>
              {loveMapData.loveLanguages.compatibility}%
            </Text>
          </View>

          {/* Big Five */}
          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
            <View className="flex-row items-center flex-1">
              <View className="bg-success/10 rounded-full p-2 mr-3">
                <Star size={20} color="#28A745" />
              </View>
              <View className="flex-1">
                <Text className="text-secondary-dark font-medium">Big Five</Text>
                <Text className="text-secondary text-sm">Năm yếu tố tính cách</Text>
              </View>
            </View>
            <Text className={`font-bold ${getCompatibilityColor(loveMapData.bigFive.compatibility)}`}>
              {loveMapData.bigFive.compatibility}%
            </Text>
          </View>
        </View>

        {/* Strengths */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-success/10 rounded-full p-3 mr-3">
              <TrendingUp size={24} color="#28A745" />
            </View>
            <Text className="text-xl font-bold text-secondary-dark">Điểm mạnh của mối quan hệ</Text>
          </View>

          {loveMapData.strengths.map((strength, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary-dark font-medium">{strength.title}</Text>
                <Text className="text-success font-bold">{strength.score}%</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full mb-2">
                <View className="h-full bg-success rounded-full" style={{ width: `${strength.score}%` }} />
              </View>
              <Text className="text-secondary text-sm">{strength.description}</Text>
            </View>
          ))}
        </View>

        {/* Areas for Improvement */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Khu vực cần cải thiện</Text>

          {loveMapData.improvements.map((improvement, index) => (
            <View key={index} className="mb-6 p-4 bg-warning/5 rounded-lg">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary-dark font-medium">{improvement.title}</Text>
                <View
                  className={`px-2 py-1 rounded-full ${
                    improvement.priority === "Cao"
                      ? "bg-danger/10"
                      : improvement.priority === "Trung bình"
                        ? "bg-warning/10"
                        : "bg-info/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      improvement.priority === "Cao"
                        ? "text-danger"
                        : improvement.priority === "Trung bình"
                          ? "text-warning"
                          : "text-info"
                    }`}
                  >
                    {improvement.priority}
                  </Text>
                </View>
              </View>
              <Text className="text-secondary text-sm mb-3">{improvement.description}</Text>
              <Text className="text-secondary-dark font-medium text-sm mb-2">Gợi ý cải thiện:</Text>
              {improvement.suggestions.map((suggestion, idx) => (
                <Text key={idx} className="text-secondary text-sm ml-2">
                  • {suggestion}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Personalized Recommendations */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Lời khuyên cá nhân hóa</Text>

          {loveMapData.recommendations.map((rec, index) => (
            <View key={index} className="mb-4 p-4 bg-primary/5 rounded-lg">
              <Text className="text-primary font-medium mb-2">{rec.category}</Text>
              <Text className="text-secondary-dark">{rec.advice}</Text>
            </View>
          ))}
        </View>

        {/* Love Languages Detail */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-secondary-dark mb-4">Chi tiết ngôn ngữ tình yêu</Text>

          <View className="mb-4">
            <Text className="text-secondary-dark font-medium mb-2">Ngôn ngữ tình yêu chính:</Text>
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-secondary text-sm">{loveMapData.userData.name}</Text>
                <View className="bg-primary/10 rounded-lg p-3 mt-1">
                  <Text className="text-primary font-medium text-center">{loveMapData.loveLanguages.userPrimary}</Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-secondary text-sm">{loveMapData.userData.partnerName}</Text>
                <View className="bg-secondary/10 rounded-lg p-3 mt-1">
                  <Text className="text-secondary font-medium text-center">
                    {loveMapData.loveLanguages.partnerPrimary}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text className="text-secondary-dark font-medium mb-3">So sánh chi tiết:</Text>
          {["Thời gian chất lượng", "Lời nói khẳng định", "Quà tặng", "Hành động phục vụ", "Tiếp xúc cơ thể"].map(
            (lang, index) => (
              <ComparisonChart
                key={lang}
                title={lang}
                userScore={loveMapData.loveLanguages.scores.user[index]}
                partnerScore={loveMapData.loveLanguages.scores.partner[index]}
                userName={loveMapData.userData.name}
                partnerName={loveMapData.userData.partnerName}
                maxScore={5}
              />
            ),
          )}
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate("SurveyList")}
            className="bg-primary rounded-xl p-4 mb-3"
          >
            <Text className="text-white font-bold text-center">Làm lại khảo sát</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CoursesTab")}
            className="bg-white border border-primary rounded-xl p-4"
          >
            <Text className="text-primary font-bold text-center">Khám phá khóa học phù hợp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default LoveMapScreen
