import React, { useEffect, useState } from "react"
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native"
import counselorApi from "@/src/config/api/counselor.api"
import { Counselor } from "@/src/config/types/counselor.type"
import Loading from "../share/Loading"

const CounselorListScreen = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await counselorApi.getAllCounselor()
        setCounselors(data)
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tư vấn viên:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loading size={60} color="#007AFF" />
        <Text className="mt-2">Đang tải danh sách tư vấn viên...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Danh sách tư vấn viên</Text>

      <FlatList
        data={counselors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 border rounded-lg bg-gray-50">
            <Text className="text-lg font-semibold">{item.fullname}</Text>
            <Text className="text-gray-600">{item.phone || "Chưa có số điện thoại"}</Text>
            <Text className="text-gray-600">{item.description || "Chưa có mô tả"}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default CounselorListScreen
