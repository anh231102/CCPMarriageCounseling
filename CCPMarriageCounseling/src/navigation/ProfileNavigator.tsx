import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileScreen from "../screens/profile/ProfileScreen"
import EditProfileScreen from "../screens/profile/EditProfileScreen"
import ProfileViewScreen from "../screens/profile/ProfileViewScreen"
import MembershipScreen from "../screens/profile/MembershipScreen"
import CoupleConnectionScreen from "../screens/profile/CoupleConnectionScreen"
import NotificationsScreen from "../screens/profile/NotificationsScreen"
import SettingsScreen from "../screens/profile/SettingsScreen"
import MyWalletScreen from "../screens/profile/MyWalletScreen"
import PersonTypeResultDetailScreen from "@/src/screens/profile/PersonTypeResultDetailScreen"
import PersonTypeHistoryScreen from "../screens/profile/PersonTypeHistoryScreen"
import PersonTypeHistoryDetailScreen from "../screens/profile/PersonTypeHistoryDetailScreen"

const Stack = createNativeStackNavigator()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  )
}

export default ProfileNavigator
