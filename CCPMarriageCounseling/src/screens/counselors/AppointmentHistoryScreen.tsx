import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowRight } from "lucide-react-native"

import bookingApi from "@/src/config/api/booking.api"
import { BookingMemberData } from "@/src/config/types/booking.type"

import Loading from "@/src/components/share/Loading"
import ConclusionModal from "@/src/components/booking/ConclusionModal"
import AppointmentItem from "@/src/components/booking/AppointmentItem"

const AppointmentHistoryScreen = () => {
  const navigation = useNavigation<any>()
  const [bookings, setBookings] = useState<BookingMemberData[]>([])
  const [loading, setLoading] = useState(true)

  const [showConclusion, setShowConclusion] = useState(false)
  const [selectedConclusion, setSelectedConclusion] = useState<{
    problemSummary: string | null
    problemAnalysis: string | null
    guides: string | null
  } | null>(null)

  const handleOpenConclusion = (conclusion: {
    problemSummary: string | null
    problemAnalysis: string | null
    guides: string | null
  }) => {
    setSelectedConclusion(conclusion)
    setShowConclusion(true)
  }

  const fetchBookings = async () => {
  setLoading(true)
  try {
    const data = await bookingApi.getMyBookings()
    setBookings(data)
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu lịch sử:", error)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  fetchBookings()
}, [])


  return (
    <>
      <View className="flex-1 bg-gray-50 p-4">
        {/* Header */}
        <TouchableOpacity
          onPress={() => navigation.navigate("CounselorList")}
          className="bg-primary/10 rounded-lg p-4 mb-6"
        >
          <Text className="text-primary font-bold text-lg mb-2">Tìm chuyên gia tư vấn</Text>
          <View className="flex-row items-center">
            <Text className="text-primary font-medium">Xem danh sách chuyên gia</Text>
            <ArrowRight size={16} color="#E83E8C" className="ml-1" />
          </View>
        </TouchableOpacity>

        {/* Booking list */}
        {loading ? (
          <Loading size={50} />
        ) : (
          <FlatList
            data={bookings}
            renderItem={({ item }) => (
              <AppointmentItem item={item} onConclusionOpen={handleOpenConclusion} onReload={fetchBookings} onUpdateItem={(updatedItem) => {
        setBookings((prev) =>
          prev.map((bk) => (bk.id === updatedItem.id ? updatedItem : bk))
        )
      }}/>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center p-6">
                <Text className="text-secondary-dark text-lg font-medium mb-2">Chưa có lịch sử tư vấn</Text>
                <Text className="text-secondary text-center mb-4">
                  Bạn chưa có buổi tư vấn nào. Hãy đặt lịch với chuyên gia để được hỗ trợ.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("CounselorList")}
                  className="bg-primary rounded-lg p-3 w-full items-center"
                >
                  <Text className="text-white font-medium">Tìm chuyên gia ngay</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      {/* Modal Kết luận */}
      {selectedConclusion && (
        <ConclusionModal
          visible={showConclusion}
          onClose={() => setShowConclusion(false)}
          problemSummary={selectedConclusion.problemSummary}
          problemAnalysis={selectedConclusion.problemAnalysis}
          guides={selectedConclusion.guides}
        />
      )}
    </>
  )
}

export default AppointmentHistoryScreen
