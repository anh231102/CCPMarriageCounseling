import { useEffect } from "react"
import { View, Text, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Loading from "@/src/components/share/Loading"
import surveyApi from "@/src/config/api/survey.api"

const LoadingBeforeSaveScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { selectedSurveyIds, roomId, isHost, answers, isSurvey } = route.params

  useEffect(() => {
    const showAlert = () => {
      Alert.alert(
        "Lưu bài khảo sát cá nhân?",
        "Bạn có muốn lưu các bài khảo sát này vào hồ sơ cá nhân không?",
        [
          {
            text: "Không",
            style: "cancel",
            onPress: () => {
              navigation.navigate("CoupleSurveyRoom", {
                roomId,
                isHost,
                isSurvey,
              })
            },
          },
          {
            text: "Lưu",
            onPress: async () => {
              try {
                
                for (const surveyId of selectedSurveyIds) {
                  

                  const filteredAnswers = answers[surveyId] || []

                  

                  if (filteredAnswers.length === 0) {
                    
                    continue
                  }

                  const groupedAnswers: Record<string, number> = {}

                  filteredAnswers.forEach((ans: any) => {
                    if (ans.tag && typeof ans.score === "number") {
                      groupedAnswers[ans.tag] =
                        (groupedAnswers[ans.tag] || 0) + ans.score
                    }
                  })

                  const personalResult = {
                    surveyId,
                    answers: Object.entries(groupedAnswers).map(([tag, score]) => ({
                      tag,
                      score,
                    })),
                  }

                  

                  await surveyApi.postSurveyResult(personalResult)
                }

                
                navigation.navigate("CoupleSurveyRoom", {
                  roomId,
                  isHost,
                  isSurvey,
                })
              } catch (error: any) {
                
                Alert.alert("Lỗi", "Không thể lưu kết quả một số khảo sát. Vui lòng thử lại.")
              }
            },
          },
        ]
      )
    }

    setTimeout(showAlert, 300)
  }, [])

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Loading size={50} />
      <Text className="text-secondary mt-3">Đang xử lý khảo sát...</Text>
    </View>
  )
}

export default LoadingBeforeSaveScreen
