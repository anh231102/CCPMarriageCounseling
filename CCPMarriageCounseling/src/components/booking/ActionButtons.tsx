import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { Calendar, FileText, Flag, Star } from "lucide-react-native"
import { X } from "lucide-react-native";
import { BookingStatus } from "@/src/config/types/booking.type";

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

export const ConclusionAndRebookButtons = ({ onConclusion, onRebook }: ButtonProps) => (
    <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={onRebook} className="flex-1 flex-row items-center justify-center bg-success/10 rounded-lg p-2">
            <Calendar size={16} color="#28A745" className="mr-1" />
            <Text className="text-success font-medium">Đặt lịch lại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConclusion} className="flex-1 flex-row ml-2 items-center justify-center bg-primary/10 rounded-lg p-2">
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

export const RebookButtons = ({ onRebook }: ButtonProps) => (
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

export const BookingConfirmActions = ({
    item,
    now,
    endTime,
    startTime,
    canStart,
    navigation,
    setInviteModalVisible,
    handleCancelInvitation,
    alertCancelBooking,
    isMember2,
}: {
    item: any,
    now: number,
    endTime: number,
    startTime: number,
    canStart: boolean,
    navigation: any,
    setInviteModalVisible: (v: boolean) => void,
    handleCancelInvitation: () => void,
    alertCancelBooking: () => void,
    isMember2: boolean,
}) => (
    item.status === BookingStatus.XacNhan && (
        <View>
            {item.isCouple === null && now <= endTime && (
                <View className="h-10 mb-3">
                    <TouchableOpacity
                        onPress={() => setInviteModalVisible(true)}
                        className="flex-1 rounded-lg p-2 mr-2 items-center bg-green-500/20 border border-green-500"
                    >
                        <Text className="font-medium text-green-500">+ Thêm đối tác vào buổi tư vấn</Text>
                    </TouchableOpacity>
                </View>
            )}
            {item.isCouple === false && now <= endTime && (
                <View className="h-10 mb-3">
                    <TouchableOpacity
                        onPress={handleCancelInvitation}
                        className="flex-1 rounded-lg p-2 py-2 mr-2 items-center bg-yellow-100 border border-yellow-500"
                    >
                        <View className="flex-row items-center">
                            <X color="#CA8A04" />
                            <Text className="font-medium text-yellow-600 ml-2">Hủy mời đối tác</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            <View className="flex-row">
                <TouchableOpacity
                    disabled={!canStart}
                    onPress={() => {
                        if (!canStart) return;
                        navigation.navigate("VideoCall", { bookingid: `${item.id}` });
                    }}
                    className={`flex-1 rounded-lg p-2 mr-2 items-center ${canStart ? "bg-primary" : "bg-gray-300"}`}
                >
                    <Text className={`font-medium ${canStart ? "text-white" : "text-gray-600"}`}>Bắt đầu tư vấn</Text>
                </TouchableOpacity>
                {!isMember2 && (
                    <TouchableOpacity
                        disabled={now >= startTime}
                        onPress={alertCancelBooking}
                        className={`flex-1 border rounded-lg p-2 ml-2 items-center ${now >= startTime
                            ? "bg-gray-300 border-gray-400"
                            : "border-red-500 bg-red-500/10"
                            }`}
                    >
                        <Text className={`font-medium ${now >= startTime ? "text-gray-600" : "text-red-500"}`}>Hủy lịch</Text>
                    </TouchableOpacity>
                )}
            </View>
            {item.status === BookingStatus.XacNhan && now > endTime && (
                <View className="mt-3 items-center">
                    <Text className="text-red-500 ">Bạn đã không tham gia buổi tư vấn</Text>
                </View>
            )}
        </View>
    )
);