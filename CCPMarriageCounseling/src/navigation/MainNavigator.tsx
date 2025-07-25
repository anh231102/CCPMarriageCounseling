import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home, BookOpen, Search, Calendar, User } from "lucide-react-native"


import HomeScreen from "@/src/screens/home/HomeScreen"; 
import CoursesNavigator from "./CoursesNavigator"
import CounselorsNavigator from "./CounselorsNavigator"
 import ProfileNavigator from "./ProfileNavigator"
// import HomeScreen from "../screens/Home"
 import SurveyNavigator from "./SurveyNavigator"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#E83E8C",
        tabBarInactiveTintColor: "#6C757D",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
       <Tab.Screen
        name="SurveyTab"
        component={SurveyNavigator}
        options={{
          tabBarLabel: "Khảo sát",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesNavigator}
        options={{
          tabBarLabel: "Khóa học",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="CounselorsTab"
        component={CounselorsNavigator}
        options={{
          tabBarLabel: "Tư vấn",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
       <Tab.Screen
       name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      /> 
      
    </Tab.Navigator>
  )
}

export default MainNavigator
