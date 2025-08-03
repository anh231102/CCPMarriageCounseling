import { createNativeStackNavigator } from "@react-navigation/native-stack"
import CourseListScreen from "../screens/courses/CourseListScreen"
import CourseDetailScreen from "../screens/courses/CourseDetailScreen"
import CourseContentScreen from "../screens/courses/CourseContentScreen"
import CourseRecommendationScreen from "../screens/courses/CourseRecommendationScreen"
import MyCourseListScreen from "../screens/courses/MyCourseListScreen"
import CourseReviewScreen from "../screens/courses/CourseReviewScreen"

const Stack = createNativeStackNavigator()

const CoursesNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CourseList">
      <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: "Khóa học kỹ năng hôn nhân" }} />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Chi tiết khóa học" })}
      />
      <Stack.Screen
        name="CourseContent"
        component={CourseContentScreen}
        options={({ route }: any) => ({ title: route.params?.title || "Nội dung khóa học" })}
      />
      <Stack.Screen
        name="CourseRecommendation"
        component={CourseRecommendationScreen}
        options={{ title: "Khóa học đề xuất" }}
      />
      <Stack.Screen
        name="MyCourseList"
        component={MyCourseListScreen}
        options={{ title: "Khóa học của tôi" }}
      />
      <Stack.Screen
        name="CourseReview"
        component={CourseReviewScreen}
        options={{ title: "Đánh giá khóa học" }}
      />
    </Stack.Navigator>
  )
}

export default CoursesNavigator
