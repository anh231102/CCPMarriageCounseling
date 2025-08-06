import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileScreen from "../screens/profile/ProfileScreen"
import EditProfileScreen from "../screens/profile/EditProfileScreen"
import ProfileViewScreen from "../screens/profile/ProfileViewScreen"
import MembershipScreen from "../screens/profile/MembershipScreen"
import CoupleConnectionScreen from "../screens/couple/CoupleConnectionScreen"
import NotificationsScreen from "../screens/profile/NotificationsScreen"
import SettingsScreen from "../screens/profile/SettingsScreen"
import MyWalletScreen from "../screens/profile/MyWalletScreen"
import PersonTypeResultDetailScreen from "@/src/screens/profile/PersonTypeResultDetailScreen"
import PersonTypeHistoryScreen from "../screens/profile/PersonTypeHistoryScreen"
import PersonTypeHistoryDetailScreen from "../screens/profile/PersonTypeHistoryDetailScreen"
import CoupleRoomSelectionScreen from "../screens/couple/CoupleRoomSelectionScreen"
import JoinCoupleRoomScreen from "../screens/couple/JoinCoupleRoomScreen"
import CoupleSurveyRoomScreen from "../screens/couple/CoupleSurveyRoomScreen"
import QRScannerScreen from "@/src/components/share/QRScannerScreen"
import CoupleSurveySelectionScreen from "../screens/couple/CoupleSurveySelectionScreen"
import LoveMapScreen from "../screens/surveys/LoveMapScreen"
import AppointmentHistoryScreen from "../screens/counselors/AppointmentHistoryScreen"
import CoupleSurveyQuestionsScreen from "../screens/couple/CoupleSurveyQuestionsScreen"
import SurveySectionCompleteScreen from "@/src/components/survey/SurveySectionCompleteScreen"
import LoadingBeforeSaveScreen from "@/src/components/couple/LoadingBeforeSaveScreen"
import LoveMapHistoryScreen from "../screens/profile/LoveMapHistoryScreen"
import VirtualSurveyQuestionsScreen from "../screens/couple/VirtualSurveyQuestionsScreen"
import { MyCourseListScreen } from "../screens/courses/MyCourseListScreen"
import { CourseDetailScreen } from "../screens/courses/CourseDetailScreen"
import CourseContentScreen from "../screens/courses/CourseContentScreen"
import CourseReviewScreen from "../screens/courses/CourseReviewScreen"
import VideoCallScreen from "../screens/counselors/VideoCallScreen"
import PaymentWebView from "../screens/profile/PaymentWebView"



const Stack = createNativeStackNavigator()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Hồ sơ cá nhân" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Chỉnh sửa hồ sơ" }} />
      <Stack.Screen name="ViewProfile" component={ProfileViewScreen} options={{ title: "Xem hồ sơ" }} />
      <Stack.Screen name="Membership" component={MembershipScreen} options={{ title: "Gói thành viên" }} />
      <Stack.Screen name="CoupleConnection" component={CoupleConnectionScreen} options={{ title: "Kết nối cặp đôi" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Thông báo" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Cài đặt" }} />
      <Stack.Screen name="Wallet" component={MyWalletScreen} options={{ title: "Ví" }} />
      <Stack.Screen
        name="PersonTypeResultDetail"
        component={PersonTypeResultDetailScreen}
        options={{ title: "Xem chi tiết kết quả khảo sát" }}
      />
      <Stack.Screen
        name="PersonTypeHistory"
        component={PersonTypeHistoryScreen}
        options={{ title: "Lịch sử khảo sát" }}
      />
      <Stack.Screen
        name="PersonTypeHistoryDetail"
        component={PersonTypeHistoryDetailScreen}
        options={{ title: "Lịch sử khảo sát" }}
      />
      <Stack.Screen
        name="CoupleRoomSelection"
        component={CoupleRoomSelectionScreen}
        options={{ title: "Tùy chọn phương thức" }}
      />
      <Stack.Screen
        name="JoinCoupleRoom"
        component={JoinCoupleRoomScreen}
        options={{ title: "Nhập mã phòng" }}
      />
      <Stack.Screen name="CoupleSurveyRoom" component={CoupleSurveyRoomScreen} options={{ title: "Phòng khảo sát cặp đôi" }} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: "Phòng khảo sát cặp đôi" }} />
      <Stack.Screen name="CoupleSurveySelection" component={CoupleSurveySelectionScreen} options={{ title: "Kết nối cặp đôi" }} />
      <Stack.Screen name="LoveMap" component={LoveMapScreen} options={{ title: "Bản đồ tình yêu" }} />
      <Stack.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{ title: "Lịch sử tư vấn" }}
      />
      <Stack.Screen
        name="CoupleSurveyQuestions"
        component={CoupleSurveyQuestionsScreen}
        options={{ title: "Làm khảo sát" }}
      />
      <Stack.Screen
        name="SurveySectionComplete"
        component={SurveySectionCompleteScreen}
        options={{ title: "Hoàn thành khảo sát" }}
      />
      <Stack.Screen
        name="LoadingBeforeSave"
        component={LoadingBeforeSaveScreen}
        options={{ title: "Hoàn thành khảo sát" }}
      />
      <Stack.Screen
        name="LoveMapHistory"
        component={LoveMapHistoryScreen}
        options={{ title: "Lịch sử bản đồ tình yêu" }}
      />
      <Stack.Screen
        name="MyCourseList"
        component={MyCourseListScreen}
        options={{ title: "Khóa học của tôi" }}
      />
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
        name="CourseReview"
        component={CourseReviewScreen}
        options={{ title: "Đánh giá khóa học" }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{ title: "Gọi tư vấn" }}
      />
      <Stack.Screen
        name="PaymentWebView"
        component={PaymentWebView}
        options={{ title: "Thanh toán" }}
      />
      <Stack.Screen name="VirtualSurveyQuestions" component={VirtualSurveyQuestionsScreen} options={{ title: "Phòng khảo sát " }} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
