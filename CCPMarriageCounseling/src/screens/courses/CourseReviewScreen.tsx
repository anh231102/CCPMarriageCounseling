import React from "react"
import { View, Text, SafeAreaView, ScrollView } from "react-native"
import { useRoute } from "@react-navigation/native"
import { CourseReviews } from "@/src/components/courses/CourseReviews"
import { CourseDetailScreen } from "./CourseDetailScreen"

type RouteParams = {
    courseId: string
}

const CourseReviewScreen = () => {
    const route = useRoute()
    // @ts-ignore
    const { courseId } = route.params as RouteParams

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <ScrollView style={{ flex: 1 }}>
                <CourseReviews CourseId={courseId} openReviewForm={false} />
            </ScrollView>
        </SafeAreaView>
    )
}
export default CourseReviewScreen