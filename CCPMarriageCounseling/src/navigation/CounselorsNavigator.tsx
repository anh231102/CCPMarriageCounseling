import { createNativeStackNavigator } from "@react-navigation/native-stack"
import CounselorListScreen from "../screens/counselors/CounselorListScreen"
import CounselorDetailScreen from "../screens/counselors/CounselorDetailScreen"
import BookAppointmentScreen from "../screens/counselors/BookAppointmentScreen"
import AppointmentConfirmationScreen from "../screens/counselors/AppointmentConfirmationScreen"
import AppointmentHistoryScreen from "../screens/counselors/AppointmentHistoryScreen"
import RateAppointmentScreen from "../screens/counselors/RateAppointmentScreen"
import VideoCallScreen from "../screens/counselors/VideoCallScreen"
import ReportAppointmentScreen from "../screens/counselors/ReportAppointmentScreen"

const Stack = createNativeStackNavigator()

const CounselorsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CounselorList">
      <Stack.Screen name="CounselorList" component={CounselorListScreen} options={{ title: "Tìm chuyên gia tư vấn" }} />
      <Stack.Screen
        name="CounselorDetail"
        component={CounselorDetailScreen}
        options={({ route }: any) => ({ title: route.params?.name || "Thông tin chuyên gia" })}
      />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ title: "Đặt lịch tư vấn" }} />
      <Stack.Screen
        name="AppointmentConfirmation"
        component={AppointmentConfirmationScreen}
        options={{ title: "Xác nhận lịch hẹn" }}
      />
      <Stack.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{ title: "Lịch sử tư vấn" }}
      />
      <Stack.Screen
        name="RateAppointment"
        component={RateAppointmentScreen}
        options={{ title: "Đánh giá buổi tư vấn" }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{ title: "Gọi tư vấn" }}
      />
      <Stack.Screen name="ReportAppointment" component={ReportAppointmentScreen}  options={{ title: "Báo cáo buổi tư vấn" }}/>


    </Stack.Navigator>
  )
}

export default CounselorsNavigator
