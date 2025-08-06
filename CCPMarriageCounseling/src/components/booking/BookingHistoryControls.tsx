import React from "react"
import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { ListFilter, Search } from "lucide-react-native"

interface Props {
  searchText: string
  setSearchText: (v: string) => void
  onOpenFilter: () => void
  page: number
  totalPages: number
  setPage: (p: number) => void
}

const BookingHistoryControls: React.FC<Props> = ({
  searchText,
  setSearchText,
  onOpenFilter,
  page,
  totalPages,
  setPage,
}) => (
  <View className="px-4 py-3 bg-white shadow-sm rounded-lg mb-4">
    {/* Search & Filter */}
    <View className="flex-row items-center justify-between mb-6">
      {/* Search Input */}
      <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-1 mr-3 flex-1 shadow-sm">
        <Search size={20} color="#9CA3AF" className="mr-3" />
        <TextInput
          placeholder="Tìm kiếm theo tên chuyên gia"
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          className="flex-1 text-gray-800 text-base"
        />
      </View>
      {/* Filter Button */}
      <TouchableOpacity
        onPress={onOpenFilter}
        className="bg-white border border-pink-300 px-4 py-3 rounded-2xl shadow-sm"
        activeOpacity={0.7}
      >
        <ListFilter size={20} color="#E83E8C" />
      </TouchableOpacity>
    </View>
    {/* Paging */}
    {totalPages > 1 && (
      <View className="flex-row justify-center items-center mt-2 mb-4">
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg mr-2 ${page === 1 ? "bg-gray-200" : "bg-pink-500"}`}
        >
          <Text className={page === 1 ? "text-gray-400" : "text-white"}>Trước</Text>
        </TouchableOpacity>
        <Text className="mx-2 font-bold text-pink-600">{page} / {totalPages}</Text>
        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ml-2 ${page === totalPages ? "bg-gray-200" : "bg-pink-500"}`}
        >
          <Text className={page === totalPages ? "text-gray-400" : "text-white"}>Sau</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
)

export default BookingHistoryControls