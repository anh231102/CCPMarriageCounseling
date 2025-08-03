import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "@/src/screens/home/HomeScreen"
import PostDetailScreen from "@/src/screens/home/PostDetailScreen"
import ListAllPostScreen from "../screens/home/ListAllPostScreen"

const Stack = createNativeStackNavigator()

const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="HomeScreen">
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Trang chủ" }} />
    <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ title: "Chi tiết bài viết" }} />
    <Stack.Screen name="ListAllPostScreen" component={ListAllPostScreen} options={{ title: "Tất cả bài viết" }} />
  </Stack.Navigator>
)

export default HomeNavigator