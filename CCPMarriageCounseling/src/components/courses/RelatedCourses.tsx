import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { Star } from "lucide-react-native"
import type { Course } from "../../config/types/course.type"

interface RelatedCoursesProps {
  currentCourseId: string
  onPressCourse: (course: Course) => void
}

// Dummy data for related courses


export const RelatedCourses: React.FC<RelatedCoursesProps> = ({ currentCourseId, onPressCourse }) => {
  

  return (
    <View className="mt-6 px-4">
        
      </View>
  )
}
