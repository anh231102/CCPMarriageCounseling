import { View, Text, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

const SurveySectionCompleteScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const {
    selectedSurveyIds,
    currentSurveyIndex,
    nextSurveyIndex,
    currentSurveyTitle,
    answers,
    userType,
    userData,
    isAuth,
  } = route.params

  const nextSurveyExists = nextSurveyIndex < selectedSurveyIds.length

  const handleNext = () => {
    navigation.replace("SurveyQuestions", {
      selectedSurveyIds,
      currentSurveyIndex: nextSurveyIndex,
      userType,
      userData,
      answers,
    })
  }

  const handleSubmit = () => {
    navigation.navigate("SurveyResults", {
      selectedSurveyIds,
      userType,
      userData,
      answers,
      isAuth,
    })
  }

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-2xl font-bold text-secondary-dark mb-4">
        Hoàn thành phần {currentSurveyTitle || `#${currentSurveyIndex + 1}`}
      </Text>
      <Text className="text-secondary mb-8 text-center">
        {nextSurveyExists
          ? "Bạn có muốn tiếp tục với phần khảo sát tiếp theo không?"
          : "Bạn đã hoàn thành tất cả các phần khảo sát."}
      </Text>

      {nextSurveyExists && (
        <TouchableOpacity onPress={handleNext} className="bg-primary px-6 py-3 rounded-full mb-4">
          <Text className="text-white font-medium">Tiếp tục khảo sát</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleSubmit} className="bg-gray-200 px-6 py-3 rounded-full">
        <Text className="text-secondary-dark font-medium">Lưu kết quả và kết thúc</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SurveySectionCompleteScreen
