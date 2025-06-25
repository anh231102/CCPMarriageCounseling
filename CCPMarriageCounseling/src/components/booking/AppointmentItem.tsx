// components/booking/AppointmentItem.tsx
import React from "react"
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { BookingMemberData, BookingStatus, getBookingStatusLabel } from "@/src/config/types/booking.type"
import bookingApi from "@/src/config/api/booking.api"
import CountdownTimer from "./CountdownTimer"
import {
    RateAndReportButtons,
    RebookAndReportButtons,
    ConclusionAndRateButtons,
    RebookAndConclusionButtons,
    RebookButtons,
    ScheduleButtons,
} from "./ActionButtons"

const getTypeIcon = (subCategories: any[]) => {
    if (!subCategories || subCategories.length === 0) return MessageCircle
    const name = subCategories[0].name.toLowerCase()
    if (name.includes("video")) return Video
    if (name.includes("thoại") || name.includes("call")) return Phone
    return MessageCircle
}

const getStatusColor = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.XacNhan:
            return { bg: "bg-blue-100", text: "text-blue-600" }
        case BookingStatus.HoanThanh:
            return { bg: "bg-green-100", text: "text-green-600" }
        case BookingStatus.DeXuatLichMoi:
            return { bg: "bg-yellow-100", text: "text-yellow-700" }
        case BookingStatus.ThanhVienHuy:
            return { bg: "bg-gray-200", text: "text-gray-700" }
        case BookingStatus.BaoCao:
            return { bg: "bg-orange-100", text: "text-orange-700" }
        case BookingStatus.HoanTien:
            return { bg: "bg-cyan-100", text: "text-cyan-700" }
        case BookingStatus.KetThuc:
            return { bg: "bg-emerald-100", text: "text-emerald-700" }
        default:
            return { bg: "bg-secondary/10", text: "text-secondary" }
    }
}

const AppointmentItem = ({ item, onConclusionOpen, onReload, onUpdateItem, }: {
    item: BookingMemberData
    onConclusionOpen: (conclusion: any) => void
    onReload: () => void
    onUpdateItem: (updatedItem: BookingMemberData) => void
}) => {
    const navigation = useNavigation<any>()
    const IconComponent = getTypeIcon(item.subCategories)
    const statusColor = getStatusColor(item.status)
    const now = new Date().getTime()
    const startTime = new Date(item.timeStart).getTime()
    const endTime = new Date(item.timeEnd).getTime()
    const canStart = startTime <= now && now <= endTime

    const alertCancelBooking = () => {
        Alert.alert("Xác nhận hủy lịch", "Việc hủy lịch sẽ bị trừ 50% số tiền booking. Bạn có chắc chắn muốn hủy?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xác nhận", style: "destructive", onPress: async () => {
                    try {
                        await bookingApi.cancelBookingByMember(item.id)
                        Alert.alert("Thành công", "Lịch đã được hủy.")
                        const updated = { ...item, status: BookingStatus.ThanhVienHuy }
                        onUpdateItem(updated)
                    } catch (error: any) {
                        Alert.alert("Lỗi", error.message || "Không thể hủy lịch")
                    }
                }
            },
        ])
    }

    return (
        <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
            {/* Header */}
            <View className="flex-row mb-3">
                <Image source={{ uri: item.counselor.avatar || "https://placeholder.svg" }} className="w-16 h-16 rounded-full" />
                <View className="ml-3 flex-1">
                    <Text className="text-secondary-dark font-bold">{item.counselor.fullname}</Text>
                    <Text className="text-secondary">{item.subCategories.map((sc) => sc.name).join(", ")}</Text>
                    <View className={`mt-1 px-2 py-0.5 rounded-full self-start ${statusColor.bg}`}>
                        <Text className={`text-xs ${statusColor.text}`}>{getBookingStatusLabel(item.status)}</Text>
                    </View>
                </View>
            </View>

            {/* Time & Type */}
            <View className="flex-row flex-wrap mb-3">
                <View className="flex-row items-center mr-4 mb-2">
                    <Calendar size={16} color="#6C757D" className="mr-1" />
                    <Text className="text-secondary">{new Date(item.timeStart).toLocaleDateString("vi-VN")}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-2">
                    <Clock size={16} color="#6C757D" className="mr-1" />
                    <Text className="text-secondary">
                        {new Date(item.timeStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(item.timeEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                </View>
                <View className="flex-row items-center mb-2">
                    <IconComponent size={16} color="#6C757D" className="mr-5 ml-2" />
                    <Text className="text-secondary">{item.subCategories[0]?.name || "Video call"}</Text>
                </View>
            </View>

            {/* Actions */}
            {item.status === BookingStatus.XacNhan && (
                <View className="flex-row">
                    <TouchableOpacity
                        disabled={!canStart}
                        onPress={() => {
                            if (!canStart) return
                            navigation.navigate("VideoCall", { bookingid: `${item.id}` })
                        }}
                        className={`flex-1 rounded-lg p-2 mr-2 items-center ${canStart ? "bg-primary" : "bg-gray-300"}`}
                    >
                        <Text className={`font-medium ${canStart ? "text-white" : "text-gray-600"}`}>Bắt đầu tư vấn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={alertCancelBooking} className="flex-1 border border-red-500 bg-red-500/10 rounded-lg p-2 ml-2 items-center">
                        <Text className="text-red-500 font-medium">Hủy lịch</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === BookingStatus.HoanThanh && item.rating === null && (
                <>
                    <RateAndReportButtons
                        onRate={() => navigation.navigate("RateAppointment", { appointmentId: item.id, counselor: item.counselor })}
                        onReport={() => navigation.navigate("ReportAppointment", { appointmentId: item.id, counselor: item.counselor })}
                    />
                    <CountdownTimer endTime={item.timeEnd} />
                </>
            )}

            {item.status === BookingStatus.HoanThanh && item.rating !== null && (
                <>
                    <RebookAndReportButtons
                        onConclusion={() => onConclusionOpen({
                            problemSummary: item.problemSummary,
                            problemAnalysis: item.problemAnalysis,
                            guides: item.guides
                        })}
                        onReport={() => navigation.navigate("ReportAppointment", { appointmentId: item.id, counselor: item.counselor })}
                    />
                    <CountdownTimer endTime={item.timeEnd} />
                </>
            )}

            {item.status === BookingStatus.KetThuc && item.rating === null && (
                <>
                    <ConclusionAndRateButtons
                        onConclusion={() => onConclusionOpen({
                            problemSummary: item.problemSummary,
                            problemAnalysis: item.problemAnalysis,
                            guides: item.guides
                        })}
                        onRate={() => navigation.navigate("RateAppointment", { appointmentId: item.id, counselor: item.counselor })}
                    />
                </>
            )}


            {item.status === BookingStatus.KetThuc && item.rating != null && (
                <RebookAndConclusionButtons
                    onConclusion={() => onConclusionOpen({
                        problemSummary: item.problemSummary,
                        problemAnalysis: item.problemAnalysis,
                        guides: item.guides
                    })}
                    onRebook={() => navigation.navigate("CounselorsTab", { screen: "CounselorList" })}
                />
            )}
            {item.status === BookingStatus.ThanhVienHuy && (
                <RebookButtons

                    onRebook={() => navigation.navigate("CounselorsTab", { screen: "CounselorList" })}
                />
            )}
            {item.status === BookingStatus.BaoCao && (


                <>
                    <View className="items-center bg-orange-100 p-2 rounded-lg mt-2 mb-2">
                        <Text className="text-orange-600 font-medium">Chờ phản hồi từ hệ thống</Text>
                    </View>
                    <ConclusionAndRateButtons
                        onConclusion={() => onConclusionOpen({
                            problemSummary: item.problemSummary,
                            problemAnalysis: item.problemAnalysis,
                            guides: item.guides
                        })}
                        onRate={() => navigation.navigate("RateAppointment", { appointmentId: item.id, counselor: item.counselor })}
                    />
                </>
            )}
            {item.status === BookingStatus.HoanTien && (
                <View className="items-center bg-cyan-100 p-2 rounded-lg mt-2">
                    <Text className="text-cyan-700 font-medium">Hoàn tiền thành công</Text>
                </View>

            )}
            {item.status === BookingStatus.DeXuatLichMoi && (
                <ScheduleButtons

                    onRebook={() => navigation.navigate("CounselorsTab", { screen: "CounselorList" })}
                />
            )}
        </View>
    )
}

export default AppointmentItem
