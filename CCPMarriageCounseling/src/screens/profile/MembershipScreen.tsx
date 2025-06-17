"use client"

import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { CheckCircle, Star, Clock, BookOpen, Calendar, X } from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"

const MembershipScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  // Giả lập dữ liệu các gói thành viên
  const membershipPlans = [
    {
      id: "basic",
      name: "Cơ bản",
      price: "Miễn phí",
      features: [
        "Truy cập các bài khảo sát cơ bản",
        "Xem bản đồ tình yêu cơ bản",
        "Truy cập 3 khóa học miễn phí",
        "Đặt lịch tư vấn với phí tiêu chuẩn",
      ],
      limitations: ["Không có tính năng kết nối cặp đôi", "Không có khóa học nâng cao", "Không có ưu đãi tư vấn"],
      current: user?.membershipType === "Cơ bản",
    },
    {
      id: "premium",
      name: "Premium",
      price: "199.000đ/tháng",
      features: [
        "Tất cả tính năng của gói Cơ bản",
        "Truy cập tất cả bài khảo sát",
        "Bản đồ tình yêu đầy đủ",
        "Truy cập tất cả khóa học",
        "Giảm 10% phí tư vấn",
        "Tính năng kết nối cặp đôi",
      ],
      limitations: [],
      current: user?.membershipType === "Premium",
    },
    {
      id: "couple",
      name: "Cặp đôi",
      price: "299.000đ/tháng",
      features: [
        "Tất cả tính năng của gói Premium",
        "Dành cho 2 người",
        "Bản đồ tình yêu đôi chi tiết",
        "Giảm 20% phí tư vấn",
        "Ưu tiên đặt lịch tư vấn",
        "Hỗ trợ 24/7",
      ],
      limitations: [],
      current: user?.membershipType === "Cặp đôi",
    },
  ]

  const handleUpgrade = (plan: any) => {
    if (plan.current) {
      Alert.alert("Thông báo", "Bạn đang sử dụng gói này")
      return
    }

    Alert.alert("Nâng cấp gói", `Bạn muốn nâng cấp lên gói ${plan.name} với giá ${plan.price}?`, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: () => {
          // Xử lý nâng cấp gói
          Alert.alert("Thành công", `Bạn đã nâng cấp lên gói ${plan.name} thành công!`)
        },
      },
    ])
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-2">Gói thành viên hiện tại</Text>
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${
                user?.membershipType === "Premium" || user?.membershipType === "Cặp đôi" ? "bg-success" : "bg-secondary"
              }`}
            />
            <Text className="text-secondary-dark font-medium">{user?.membershipType || "Cơ bản"}</Text>
          </View>
          <Text className="text-secondary mt-1">Hết hạn: 31/12/2023</Text>
        </View>

        <Text className="text-lg font-bold text-secondary-dark mb-3">Chọn gói thành viên</Text>

        {membershipPlans.map((plan) => (
          <View
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden ${
              plan.current ? "border-2 border-primary" : ""
            }`}
          >
            {plan.current && (
              <View className="bg-primary py-1 px-3">
                <Text className="text-white text-center font-medium">Gói hiện tại</Text>
              </View>
            )}

            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-secondary-dark">{plan.name}</Text>
                <Text className="text-primary font-bold">{plan.price}</Text>
              </View>

              <View className="mb-4">
                {plan.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <CheckCircle size={16} color="#28A745" className="mr-2" />
                    <Text className="text-secondary">{feature}</Text>
                  </View>
                ))}

                {plan.limitations.map((limitation, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <X size={16} color="#DC3545" className="mr-2" />
                    <Text className="text-secondary">{limitation}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleUpgrade(plan)}
                className={`rounded-lg p-3 items-center ${
                  plan.current ? "bg-success" : plan.id === "basic" ? "bg-secondary" : "bg-primary"
                }`}
              >
                <Text className="text-white font-medium">
                  {plan.current ? "Gói hiện tại" : plan.id === "basic" ? "Gói miễn phí" : "Nâng cấp"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">So sánh các gói</Text>

          <View className="mb-3">
            <View className="flex-row border-b border-gray-200 pb-2 mb-2">
              <Text className="flex-1 font-medium text-secondary-dark">Tính năng</Text>
              <Text className="w-20 text-center font-medium text-secondary-dark">Cơ bản</Text>
              <Text className="w-20 text-center font-medium text-secondary-dark">Premium</Text>
              <Text className="w-20 text-center font-medium text-secondary-dark">Cặp đôi</Text>
            </View>

            <View className="flex-row items-center border-b border-gray-100 py-2">
              <View className="flex-row items-center flex-1">
                <BookOpen size={16} color="#6C757D" className="mr-2" />
                <Text className="text-secondary">Khảo sát</Text>
              </View>
              <Text className="w-20 text-center text-secondary">Cơ bản</Text>
              <Text className="w-20 text-center text-secondary">Đầy đủ</Text>
              <Text className="w-20 text-center text-secondary">Đầy đủ</Text>
            </View>

            <View className="flex-row items-center border-b border-gray-100 py-2">
              <View className="flex-row items-center flex-1">
                <Star size={16} color="#6C757D" className="mr-2" />
                <Text className="text-secondary">Bản đồ tình yêu</Text>
              </View>
              <Text className="w-20 text-center text-secondary">Cơ bản</Text>
              <Text className="w-20 text-center text-secondary">Đầy đủ</Text>
              <Text className="w-20 text-center text-secondary">Chi tiết</Text>
            </View>

            <View className="flex-row items-center border-b border-gray-100 py-2">
              <View className="flex-row items-center flex-1">
                <BookOpen size={16} color="#6C757D" className="mr-2" />
                <Text className="text-secondary">Khóa học</Text>
              </View>
              <Text className="w-20 text-center text-secondary">3 khóa</Text>
              <Text className="w-20 text-center text-secondary">Tất cả</Text>
              <Text className="w-20 text-center text-secondary">Tất cả</Text>
            </View>

            <View className="flex-row items-center border-b border-gray-100 py-2">
              <View className="flex-row items-center flex-1">
                <Calendar size={16} color="#6C757D" className="mr-2" />
                <Text className="text-secondary">Ưu đãi tư vấn</Text>
              </View>
              <Text className="w-20 text-center text-secondary">Không</Text>
              <Text className="w-20 text-center text-secondary">-10%</Text>
              <Text className="w-20 text-center text-secondary">-20%</Text>
            </View>

            <View className="flex-row items-center py-2">
              <View className="flex-row items-center flex-1">
                <Clock size={16} color="#6C757D" className="mr-2" />
                <Text className="text-secondary">Hỗ trợ</Text>
              </View>
              <Text className="w-20 text-center text-secondary">Cơ bản</Text>
              <Text className="w-20 text-center text-secondary">Ưu tiên</Text>
              <Text className="w-20 text-center text-secondary">24/7</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MembershipScreen
