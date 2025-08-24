// components/booking/AppointmentItem.tsx
import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, Alert, Modal, TextInput, } from "react-native"
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
    SquareX,
    X,
    CalendarPlus2
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
    BookingConfirmActions,
} from "./ActionButtons"
import { useAuth } from "../../hooks/useAuth"
import InvitePartnerModal from "./InvitePartnerModal"

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
    const { user } = useAuth()
    const navigation = useNavigation<any>()
    const IconComponent = getTypeIcon(item.subCategories)
    const statusColor = getStatusColor(item.status)
    const now = new Date().getTime()
    const startTime = new Date(item.timeStart).getTime()
    const endTime = new Date(item.timeEnd).getTime()
    const canStart = startTime <= now && now <= endTime
    const [inviteModalVisible, setInviteModalVisible] = useState(false)
    const [inviteCode, setInviteCode] = useState("")
    const [loadingInvite, setLoadingInvite] = useState(false)
    const [errorInvite, setErrorInvite] = useState("")

    // Xác định đối tác
    const partner =
        user?.id === item.member.id
            ? item.member2
            : user?.id === item.member2?.id
                ? item.member
                : null;

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
    const handleCancelInvitation = () => {
        Alert.alert(
            "Xác nhận hủy lời mời",
            "Bạn có muốn hủy lời mời đối tác không?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Có", style: "destructive", onPress: async () => {
                        try {
                            await bookingApi.postCancelInvitation(item.id)
                            Alert.alert("Thành công", "Đã hủy lời mời đối tác.")
                            onReload()
                        } catch (err: any) {
                            const backendError =
                                err?.response?.data?.error ||
                                err?.message ||
                                "Không thể hủy lời mời"
                            console.log("Lỗi hủy lời mời:", err)
                            Alert.alert("Lỗi", backendError)
                        }
                    }
                }
            ]
        )
    }
    const handleInvitePartner = async () => {
        if (!inviteCode.trim()) {
            setErrorInvite("Vui lòng nhập mã đối tác")
            return
        }
        setLoadingInvite(true)
        setErrorInvite("")
        try {
            await bookingApi.putAssignMember2(item.id, inviteCode.trim())
            setInviteModalVisible(false)
            setInviteCode("")
            onReload()
            Alert.alert("Thành công", "Đã gửi lời mời đối tác tham gia buổi tư vấn.")
        } catch (err: any) {
            setErrorInvite(err.message || "Gửi lời mời thất bại")
        } finally {
            setLoadingInvite(false)
        }
    }

    return (
        <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
            {/* Header */}
            <View className="flex-col bg-white rounded-2xl   mb-4">

                {/* Counselor Information Section */}
                <View className="flex-col  mb-1 pb-4 border-b border-gray-100">
                    <View className="bg-pink-50 p-2 rounded-xl mr-3 self-start">
                        <Text className="text-pink-600 font-semibold text-sm">Tư vấn viên</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                        <Image
                            source={{
                                uri: item.counselor.avatar || "https://placehold.co/64x64.png?text=User",
                            }}
                            className="w-16 h-16 rounded-full border-2 border-pink-100 mr-4"
                        />

                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-lg mb-1" numberOfLines={1}>
                                {item.counselor.fullname}
                            </Text>

                            <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
                                {item.subCategories.map((sc: any) => sc.name).join(", ")}
                            </Text>

                            <View className={` px-3 py-1 rounded-full self-start ${statusColor.bg}`}>
                                <Text className={`text-xs font-semibold ${statusColor.text}`}>
                                    {getBookingStatusLabel(item.status)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Partner Information Section */}
                {partner && (
                    <View className="flex-col pt-4 border-b border-gray-100">
                        <View className="bg-blue-50 p-2 rounded-xl mr-3 mb-3 self-start">
                            <Text className="text-blue-600 font-semibold text-sm">Đối tác</Text>
                        </View>
                        <View className="flex-row items-center mb-3">

                            <View className="flex-row items-center flex-1">
                                <Image
                                    source={
                                        partner.avatar
                                            ? { uri: partner.avatar }
                                            : require("../../../assets/images/avatar.jpg")
                                    }
                                    className="w-10 h-10 rounded-full border-2 border-blue-100 mr-3"
                                />
                                <Text className="text-gray-800 font-medium text-base" numberOfLines={1}>
                                    {partner.fullname}
                                </Text>
                            </View>

                        </View>
                        {user?.id !== item.member2?.id && (
                            <>
                                {item.isCouple === false && (
                                    <Text className="text-orange-600 ml-2 mb-2">Đang đợi phản hồi của đối tác</Text>
                                )}
                                {item.isCouple === true && (
                                    <Text className="text-green-600 ml-2 mb-2">Đối tác đã xác nhận</Text>
                                )}
                            </>
                        )}
                    </View>)}

            </View>

            {/* Time & Type */}
            <View className="mb-3 border-b border-gray-200 pb-2">
                {/* Tiêu đề */}
                <Text className="font-semibold text-base mb-2">Thông tin buổi Tư vấn</Text>

                {/* Nhóm thông tin chính */}
                <View className="flex-row ">
                    {/* Ngày */}
                    <View className="flex-row items-center mr-4 mb-2">
                        <Calendar size={16} color="#6C757D" className="mr-1" />
                        <Text className="text-secondary">
                            {new Date(item.timeStart).toLocaleDateString("vi-VN")}
                        </Text>
                    </View>

                    {/* Giờ */}
                    <View className="flex-row items-center mr-4 mb-2">
                        <Clock size={16} color="#6C757D" className="mr-1" />
                        <Text className="text-secondary">
                            {new Date(item.timeStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                            {new Date(item.timeEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Text>
                    </View>

                    {/* Hình thức */}
                    <View className="flex-row items-center mb-2">
                        <IconComponent size={16} color="#6C757D" className="mr-2" />
                        <Text className="text-secondary">
                            {item.subCategories[0]?.name || "Video call"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Thời điểm đặt lịch */}
            <View className="flex-row items-center mb-4">
                <CalendarPlus2 size={16} color="#6C757D" className="mr-1" />
                <Text className="text-secondary ml-1">
                    Ngày tạo lịch: {new Date(item.createAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })},{" "}
                    {new Date(item.createAt).toLocaleDateString("vi-VN")}
                </Text>
            </View>

            {/* Actions */}
            {item.status === BookingStatus.XacNhan && (
                <>
                    <BookingConfirmActions
                        item={item}
                        now={now}
                        endTime={endTime}
                        startTime={startTime}
                        canStart={canStart}
                        navigation={navigation}
                        setInviteModalVisible={setInviteModalVisible}
                        handleCancelInvitation={handleCancelInvitation}
                        alertCancelBooking={alertCancelBooking}
                        isMember2={user?.id === item.member2?.id}
                    />
                </>
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
            <InvitePartnerModal
                visible={inviteModalVisible}
                onClose={() => setInviteModalVisible(false)}
                inviteCode={inviteCode}
                setInviteCode={setInviteCode}
                loadingInvite={loadingInvite}
                errorInvite={errorInvite}
                handleInvitePartner={handleInvitePartner}
            />

        </View>
    )
}

export default AppointmentItem
