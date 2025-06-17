import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ProfileScreen from "../screens/profile/ProfileScreen"
import EditProfileScreen from "../screens/profile/EditProfileScreen"
import MembershipScreen from "../screens/profile/MembershipScreen"
import CoupleConnectionScreen from "../screens/profile/CoupleConnectionScreen"
import NotificationsScreen from "../screens/profile/NotificationsScreen"
import SettingsScreen from "../screens/profile/SettingsScreen"

const Stack = createNativeStackNavigator()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Hồ sơ cá nhân" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Chỉnh sửa hồ sơ" }} />
      <Stack.Screen name="Membership" component={MembershipScreen} options={{ title: "Gói thành viên" }} />
      <Stack.Screen name="CoupleConnection" component={CoupleConnectionScreen} options={{ title: "Kết nối cặp đôi" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Thông báo" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Cài đặt" }} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator
