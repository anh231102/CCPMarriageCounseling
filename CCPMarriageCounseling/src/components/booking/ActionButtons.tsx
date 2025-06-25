import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { Calendar, FileText, Flag, Star } from "lucide-react-native"

type ButtonProps = {
    onRate?: () => void
    onReport?: () => void
    onConclusion?: () => void
    onRebook?: () => void
}

export const RateAndReportButtons = ({ onRate, onReport }: ButtonProps) => (
    <View ><Text className="text-secondary font-medium mb-2">Hãy đánh giá để xem kết luận!</Text>
    <View className="flex-row justify-between mb-2">
        
        <TouchableOpacity onPress={onRate} className="flex-row items-center justify-center bg-primary/10 rounded-lg p-2 mr-2 flex-1">
            <Star size={16} color="#E83E8C" className="mr-1" />
            <Text className="text-primary font-medium">Đánh giá buổi tư vấn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReport} className="flex-row items-center justify-center bg-yellow-500/10 rounded-lg p-2 flex-1">
            <Flag size={16} color="#FFC107" className="mr-1" />
            <Text className="text-yellow-500 font-medium">Báo cáo buổi tư vấn</Text>
        </TouchableOpacity>
    </View></View>
)

export const ConclusionAndRateButtons = ({ onConclusion, onRate }: ButtonProps) => (
    <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={onRate} className="flex-row items-center justify-center bg-primary/10 rounded-lg p-2 mr-2 flex-1">
            <Star size={16} color="#E83E8C" className="mr-1" />
            <Text className="text-primary font-medium">Đánh giá buổi tư vấn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConclusion} className="flex-1 flex-row items-center justify-center bg-primary/10 rounded-lg p-2">
            <FileText size={16} color="#E83E8C" className="mr-1" />
            <Text className="text-primary font-medium">Xem kết luận</Text>
        </TouchableOpacity>
    </View>
)

export const RebookAndReportButtons = ({ onConclusion, onReport }: ButtonProps) => (
    <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={onConclusion} className="flex-1 flex-row items-center justify-center bg-primary/10 rounded-lg p-2">
            <FileText size={16} color="#E83E8C" className="mr-1" />
            <Text className="text-primary font-medium">Xem kết luận</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReport} className="flex-row items-center justify-center bg-yellow-500/10 rounded-lg p-2 flex-1">
            <Flag size={16} color="#FFC107" className="mr-1" />
            <Text className="text-yellow-500 font-medium">Báo cáo buổi tư vấn</Text>
        </TouchableOpacity>
    </View>
)

export const RebookAndConclusionButtons = ({ onRebook, onConclusion }: ButtonProps) => (
    <View className="flex-row gap-2 mt-4">
        <TouchableOpacity onPress={onConclusion} className="flex-1 flex-row items-center justify-center bg-primary/10 rounded-lg p-2">
            <FileText size={16} color="#E83E8C" className="mr-1" />
            <Text className="text-primary font-medium">Xem kết luận</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRebook} className="flex-1 flex-row items-center justify-center bg-success/10 rounded-lg p-2">
            <Calendar size={16} color="#28A745" className="mr-1" />
            <Text className="text-success font-medium">Đặt lịch lại</Text>
        </TouchableOpacity>
    </View>
)

export const RebookButtons = ({ onRebook}: ButtonProps) => (
    <View className="flex-row gap-2 mt-4">

        <TouchableOpacity onPress={onRebook} className="flex-1 flex-row items-center justify-center bg-success/10 rounded-lg p-2">
            <Calendar size={16} color="#28A745" className="mr-1" />
            <Text className="text-success font-medium">Đặt lịch lại</Text>
        </TouchableOpacity>
    </View>
)

export const ScheduleButtons = ({ onRebook }: ButtonProps) => (
    <View className="flex-row mt-2">
        <TouchableOpacity onPress={onRebook} className="flex-1 bg-green-500/10 rounded-lg p-2 mr-2 items-center">
            <Text className="text-green-500 font-medium">Đồng ý</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-red-500/10 rounded-lg p-2 ml-2 items-center">
            <Text className="text-red-500 font-medium">Từ chối</Text>
        </TouchableOpacity>
    </View>
)
