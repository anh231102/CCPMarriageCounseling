"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Search, Filter, ArrowRight } from "lucide-react-native"
import Loading from "@/src/components/share/Loading";
import counselorApi from "@/src/config/api/counselor.api"
import { Counselor } from "@/src/config/types/counselor.type"
import CounselorListFull from "@/src/components/counselor/CounselorListFull"
import CounselorFilterModal from "@/src/components/counselor/CounselorFilterModal"
import { SubCategory } from "@/src/config/types/category.type"
import { FilterState } from "@/src/config/types/counselor.type"

const PAGE_SIZE = 5



const CounselorListScreen = () => {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    selectedSubCategories: [],
    rating: 0,
  })
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([])
  const [page, setPage] = useState(1)


  // Fetch counselors
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const data = await counselorApi.getCounselorWithSub()
        setCounselors(data)
        // Lấy subCategories duy nhất
        const all = data.flatMap(c => c.subCategories)
        const unique = Array.from(new Set(all.map(s => s.id)))
          .map(id => all.find(s => s.id === id))
          .filter((cat): cat is SubCategory => !!cat)
        setAllSubCategories(unique)
      } catch (err) {
       
      } finally {
        setLoading(false)
      }
    }
    fetchCounselors()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await counselorApi.getCounselorWithSub()
      setCounselors(data)
      // Cập nhật lại subCategories nếu cần
      const all = data.flatMap(c => c.subCategories)
      const unique = Array.from(new Set(all.map(s => s.id)))
        .map(id => all.find(s => s.id === id))
        .filter((cat): cat is SubCategory => !!cat)
      setAllSubCategories(unique)
    } catch (err) {
      
    } finally {
      setRefreshing(false)
    }
  }

  // Lọc và phân trang
  const filtered = counselors.filter((item) => {
    const matchName = item.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPrice = (!filter.minPrice || item.price >= +filter.minPrice) && (!filter.maxPrice || item.price <= +filter.maxPrice)
    const matchYear = (!filter.minYear || item.yearOfJob >= +filter.minYear) && (!filter.maxYear || item.yearOfJob <= +filter.maxYear)
    const matchSub = filter.selectedSubCategories.length === 0 || item.subCategories.some((cat) => filter.selectedSubCategories.includes(cat.id))
    const matchRating = !filter.rating || (item.rating ?? 0) >= filter.rating
    return matchName && matchPrice && matchYear && matchSub && matchRating
  })
  const paged = filtered.slice(0, page * PAGE_SIZE)

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row mb-4">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 mr-2 border border-gray-200">
          <Search size={18} color="#6C757D" />
          <TextInput
            className="flex-1 p-2"
            placeholder="Tìm kiếm chuyên gia"
            placeholderTextColor="#6C757D"
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text)
              setPage(1)
            }}
          />
        </View>
        <TouchableOpacity onPress={() => setShowFilter(true)} className="bg-white p-2 rounded-lg border border-gray-200">
          <Filter size={20} color="#E83E8C" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("AppointmentHistory")}
        className="bg-primary/10 rounded-lg p-4 mb-6 border border-primary"
      >
        <View className="flex-row items-center mb-2">
          <Text className="text-primary font-bold text-lg ">Lịch sử tư vấn</Text>
          <ArrowRight size={16} color="#E83E8C" className="ml-1" />
        </View>
        <Text className="text-primary font-medium">Xem lại các buổi tư vấn đã đặt và đánh giá chuyên gia</Text>
      </TouchableOpacity>

      {loading ? (
        <Loading size={60} />
      ) : (
        <>
          <CounselorListFull
            data={paged}
            searchQuery={""} // Đã lọc ở ngoài, không cần lọc lại trong component con
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          {paged.length < filtered.length && (
            <TouchableOpacity
              className="bg-primary rounded-lg py-3 mt-4"
              onPress={() => setPage(page + 1)}
            >
              <Text className="text-white text-center font-bold">Tải thêm</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <CounselorFilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(f) => {
          setFilter(f)
          setPage(1)
        }}
        allSubCategories={allSubCategories}
        initialFilter={filter}
      />
    </View>
  )
}

export default CounselorListScreen