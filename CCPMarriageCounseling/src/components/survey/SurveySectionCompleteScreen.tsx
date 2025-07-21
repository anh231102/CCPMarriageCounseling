import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

const SurveySectionCompleteScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const {
    selectedSurveyIds,
    currentSurveyIndex,
    nextSurveyIndex,
    currentSurveyTitle,
    resultText,
    userType,
    userData,
    isAuth,
    couple, // 👈 thêm dòng này
  } = route.params

  const completedSurveyIds = selectedSurveyIds.slice(0, currentSurveyIndex + 1)
  const nextSurveyExists = nextSurveyIndex < selectedSurveyIds.length

  const handleNext = () => {
    navigation.replace(couple ? "CoupleSurveyQuestions" : "SurveyQuestions", {
      selectedSurveyIds,
      currentSurveyIndex: nextSurveyIndex,
      userType,
      userData,
      isAuth,
      roomId: route.params?.roomId,
      isHost: route.params?.isHost,
    })
  }

  const handleSubmit = () => {
    if (completedSurveyIds.length === 0) {
      Alert.alert("Thông báo", "Bạn chưa hoàn thành phần khảo sát nào.")
      return
    }

    navigation.navigate("SurveyResults", {
      results: {
        surveyType: "all",
        resultText,
        userData: userData || { name: "Bạn", partnerName: "Đối tác" },
        surveyIds: completedSurveyIds,
      },
      isAuthenticated: isAuth,
    })
  }

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold text-secondary-dark mb-4">
        Hoàn thành phần {currentSurveyTitle || `#${currentSurveyIndex + 1}`}
      </Text>

      {!couple && (
        <Text className="text-secondary mb-8 text-center">
          {nextSurveyExists
            ? "Bạn có muốn tiếp tục với phần khảo sát tiếp theo không?"
            : "Bạn đã hoàn thành tất cả các phần khảo sát."}
        </Text>
      )}

      {nextSurveyExists && (
        <TouchableOpacity onPress={handleNext} className="bg-primary px-6 py-3 rounded-full mb-4">
          <Text className="text-white font-medium">Tiếp tục khảo sát</Text>
        </TouchableOpacity>
      )}

      {/* Chỉ hiển thị nút lưu nếu KHÔNG phải couple */}
      {!couple && (
        <TouchableOpacity onPress={handleSubmit} className="bg-gray-200 px-6 py-3 rounded-full">
          <Text className="text-secondary-dark font-medium">Lưu kết quả và kết thúc</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SurveySectionCompleteScreen
