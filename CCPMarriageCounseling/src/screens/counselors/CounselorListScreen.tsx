"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Search, Filter, ArrowRight } from "lucide-react-native"
import Loading from "@/src/components/share/Loading";
import counselorApi from "@/src/config/api/counselor.api"
import { Counselor } from "@/src/config/types/counselor.type"
import CounselorListFull from "@/src/components/counselor/CounselorListFull"

const CounselorListScreen = () => {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const data = await counselorApi.getCounselorWithSub()
        setCounselors(data)
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tư vấn viên:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCounselors()
  }, [])

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row mb-4">
        <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 mr-2 border border-gray-200">
          <Search size={18} color="#6C757D" />
          <TextInput
            className="flex-1 p-2"
            placeholder="Tìm kiếm chuyên gia"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-lg border border-gray-200">
          <Filter size={18} color="#6C757D" />
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
         <Loading size={60}/>
      ) : (
        <CounselorListFull data={counselors} searchQuery={searchQuery} />
      )}
    </View>
  )
}

export default CounselorListScreen
