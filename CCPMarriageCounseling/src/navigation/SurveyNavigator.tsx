import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SurveyListScreen from "../screens/surveys/SurveyListScreen"
import SurveyDetailScreen from "../screens/surveys/SurveyDetailScreen"
import SurveyOptionsScreen from "../screens/surveys/SurveyOptionsScreen"
import SelfCheckScreen from "../screens/surveys/SelfCheckScreen"
import SurveyQuestionsScreen from "../screens/surveys/SurveyQuestionsScreen"
import SurveyResultsScreen from "../screens/surveys/SurveyResultsScreen"
import LoveMapScreen from "../screens/surveys/LoveMapScreen"
import SurveySectionCompleteScreen from "@/src/components/survey/SurveySectionCompleteScreen"
import CoupleConnectionScreen from "../screens/profile/CoupleConnectionScreen"
import CoupleSurveyRoomScreen from "../screens/profile/CoupleSurveyRoomScreen"


const Stack = createNativeStackNavigator()

const SurveyNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SurveyList" component={SurveyListScreen} options={{ title: "Khảo sát hôn nhân" }} />
      <Stack.Screen
        name="SurveyDetail"
        component={SurveyDetailScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Chi tiết khảo sát" })}
      />
      <Stack.Screen
        name="SurveyOptions"
        component={SurveyOptionsScreen}
        options={{ title: "Chọn đối tượng khảo sát" }}
      />
      <Stack.Screen
        name="SelfCheck"
        component={SelfCheckScreen}
        options={{ title: "Thông tin đối tác" }}
      />
      <Stack.Screen
        name="SurveyQuestions"
        component={SurveyQuestionsScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Câu hỏi khảo sát" })}
      />
      <Stack.Screen
        name="SurveySectionComplete"
        component={SurveySectionCompleteScreen}
        options={{ title: "Hoàn thành khảo sát" }}
      />
      
      <Stack.Screen name="SurveyResults" component={SurveyResultsScreen} options={{ title: "Kết quả khảo sát" }} />
      <Stack.Screen name="LoveMap" component={LoveMapScreen} options={{ title: "Bản đồ tình yêu" }} />
      <Stack.Screen name="CoupleConnection" component={CoupleConnectionScreen} options={{ title: "Kết nối cặp đôi" }} />
      <Stack.Screen name="CoupleSurveyRoom" component={CoupleSurveyRoomScreen} options={{ title: "Phòng khảo sát cặp đôi" }} />
    </Stack.Navigator>
  )
}

export default SurveyNavigator
