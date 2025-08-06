"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowRight, CalendarDays, Users } from "lucide-react-native"

import bookingApi from "@/src/config/api/booking.api"
import { type BookingMemberData, BookingStatus, getBookingStatusLabel } from "@/src/config/types/booking.type"
import Loading from "@/src/components/share/Loading"
import ConclusionModal from "@/src/components/booking/ConclusionModal"
import AppointmentItem from "@/src/components/booking/AppointmentItem"
import BookingHistoryControls from "@/src/components/booking/BookingHistoryControls"
import BookingFilterModal from "@/src/components/booking/BookingFilterModal"
import EmptyInvitation from "@/src/components/booking/EmptyInvitation"

const { width } = Dimensions.get("window")
const PAGE_SIZE = 8

const statusOptions = [
  { value: null, label: "Tất cả" },
  ...Object.values(BookingStatus)
    .filter((v) => typeof v === "number")
    .map((v) => ({
      value: v,
      label: getBookingStatusLabel(v as BookingStatus),
    })),
]

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
]

const AppointmentHistoryScreen = () => {
  const navigation = useNavigation<any>()
  const [bookings, setBookings] = useState<BookingMemberData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"history" | "invitation">("history")
  const [searchText, setSearchText] = useState("")
  const [sortType, setSortType] = useState<"newest" | "oldest">("newest")
  const [statusFilter, setStatusFilter] = useState<number | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)
  const slideAnim = useState(new Animated.Value(width))[0]
  const [page, setPage] = useState(1)
  const [showConclusion, setShowConclusion] = useState(false)
  const [selectedConclusion, setSelectedConclusion] = useState<{
    problemSummary: string | null
    problemAnalysis: string | null
    guides: string | null
  } | null>(null)

  // Fetch bookings
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

  // Reset page về 1 khi filter/search thay đổi
  useEffect(() => {
    setPage(1)
  }, [searchText, sortType, statusFilter])

  // Hiệu ứng trượt panel filter
  useEffect(() => {
    if (filterVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }, [filterVisible])

  // Filter & search logic
  const filteredBookings = bookings
    .filter(
      (bk) =>
        (!searchText ||
          bk.counselor.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
          bk.note?.toLowerCase().includes(searchText.toLowerCase())) &&
        (statusFilter === null || bk.status === statusFilter),
    )
    .sort((a, b) => {
      const tA = new Date(a.timeStart).getTime()
      const tB = new Date(b.timeStart).getTime()
      return sortType === "newest" ? tB - tA : tA - tB
    })

  // Paging logic
  const total = filteredBookings.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pagedBookings = filteredBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleOpenConclusion = (conclusion: {
    problemSummary: string | null
    problemAnalysis: string | null
    guides: string | null
  }) => {
    setSelectedConclusion(conclusion)
    setShowConclusion(true)
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Tabs */}
        <View className="bg-white border-b border-gray-100 shadow-sm">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab("history")}
              className={`flex-1 py-4 items-center border-b-2 ${activeTab === "history" ? "border-pink-500" : "border-transparent"
                }`}
              activeOpacity={0.7}
            >
              <Text className={`font-bold text-base ${activeTab === "history" ? "text-pink-600" : "text-gray-600"}`}>
                Lịch sử tư vấn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("invitation")}
              className={`flex-1 py-4 items-center border-b-2 ${activeTab === "invitation" ? "border-pink-500" : "border-transparent"
                }`}
              activeOpacity={0.7}
            >
              <Text className={`font-bold text-base ${activeTab === "invitation" ? "text-pink-600" : "text-gray-600"}`}>
                Lời mời của bạn
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={activeTab === "history" ? pagedBookings : []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
          ListHeaderComponent={
            <>
              {/* Header - Find Counselor */}
              <TouchableOpacity
                onPress={() => navigation.navigate("CounselorList")}
                className="bg-pink-50 rounded-2xl p-4 mb-6 shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-pink-600 font-bold text-xl mb-2">Tìm chuyên gia tư vấn</Text>
                <View className="flex-row items-center">
                  <Text className="text-pink-500 font-medium text-base">Xem danh sách chuyên gia</Text>
                  <ArrowRight size={18} color="#E83E8C" className="ml-2" />
                </View>
              </TouchableOpacity>

              {/* BookingHistoryControls */}
              {activeTab === "history" && (
                <BookingHistoryControls
                  searchText={searchText}
                  setSearchText={setSearchText}
                  onOpenFilter={() => setFilterVisible(true)}
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              )}
            </>
          }
          renderItem={({ item }) => (
            <AppointmentItem
              item={item}
              onConclusionOpen={handleOpenConclusion}
              onReload={fetchBookings}
              onUpdateItem={(updatedItem) => {
                setBookings((prev) => prev.map((bk) => (bk.id === updatedItem.id ? updatedItem : bk)))
              }}
            />
          )}
          ListEmptyComponent={
            activeTab === "history" ? (
              loading ? (
                <Loading size={50} />
              ) : (
                <View className="items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
                  <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <CalendarDays size={32} color="#9CA3AF" />
                  </View>
                  <Text className="text-gray-700 text-lg font-bold mb-2 text-center">Chưa có lịch sử tư vấn</Text>
                  <Text className="text-gray-500 text-center mb-6">
                    Bạn chưa có buổi tư vấn nào. Hãy đặt lịch với chuyên gia để được hỗ trợ.
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CounselorList")}
                    className="bg-pink-500 rounded-2xl p-4 w-full items-center shadow-md"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white font-bold text-base">Tìm chuyên gia ngay</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <EmptyInvitation onReloadHistory={fetchBookings} />
            )
          }
        />
      </SafeAreaView>

      {/* Filter Modal - slides from right */}
      <BookingFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        slideAnim={slideAnim}
        width={width}
        sortType={sortType}
        setSortType={setSortType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOptions={sortOptions}
        statusOptions={statusOptions}
      />

      {/* Conclusion Modal */}
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