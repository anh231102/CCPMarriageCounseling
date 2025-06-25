"use client"

import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { UserCircle, Users, ArrowRight, Plus, Heart } from "lucide-react-native"
import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../hooks/useAuth"


const SurveyOptionsScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  // Giả lập dữ liệu đối tác đã kết nối
  const connectedPartners = [
    {
      id: "1",
      name: "Nguyễn Thị B",
      relationship: "Vợ/Chồng",
      avatar: "https://placeholder.svg?height=60&width=60",
      isOnline: true,
    },
    {
      id: "2",
      name: "Trần Văn C",
      relationship: "Người yêu",
      avatar: "https://placeholder.svg?height=60&width=60",
      isOnline: false,
    },
  ]

  const handleSelfCheck = () => {
    navigation.navigate("SelfCheck")
  }

  const handlePartnerSurvey = (partner: any) => {
    navigation.navigate("SurveyQuestions", {
      userType: "authenticated",
      partnerId: partner.id,
      partnerName: partner.name,
    })
  }

  const handleConnectPartner = () => {
    navigation.navigate("ProfileTab", { screen: "CoupleConnection" })
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-4">
            <View className="bg-primary/10 rounded-full p-4 mb-3">
              <Heart size={32} color="#E83E8C" />
            </View>
            <Text className="text-xl font-bold text-secondary-dark text-center">Bộ khảo sát tổng hợp</Text>
            <Text className="text-secondary text-center mt-2">Chọn cách thức thực hiện khảo sát phù hợp với bạn</Text>
          </View>
        </View>

        {/* Option 1: Self Check */}
        <TouchableOpacity
          onPress={handleSelfCheck}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-primary"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 rounded-full p-3 mr-4">
              <UserCircle size={28} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-secondary-dark">Tự khảo sát</Text>
              <Text className="text-primary text-sm font-medium">Khuyến nghị cho lần đầu</Text>
            </View>
            <ArrowRight size={20} color="#E83E8C" />
          </View>

          <Text className="text-secondary mb-4">
            Bạn sẽ nhập thông tin của đối tác và trả lời các câu hỏi cho cả hai người. Phù hợp khi đối tác chưa có tài
            khoản hoặc muốn thực hiện nhanh chóng.
          </Text>

          <View className="bg-primary/5 rounded-xl p-3">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-success rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Nhanh chóng và tiện lợi</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-success rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Không cần đối tác có tài khoản</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 2: Partner Survey */}
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 rounded-full p-3 mr-4">
              <Users size={28} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-secondary-dark">Mời đối tác làm khảo sát</Text>
              <Text className="text-primary text-sm font-medium">Kết quả chính xác nhất</Text>
            </View>
          </View>

          {connectedPartners.length > 0 ? (
            <View className="mb-4">
              <Text className="text-secondary-dark font-medium mb-3">Chọn đối tác:</Text>
              <View className="space-y-3">
                {connectedPartners.map((partner) => (
                  <TouchableOpacity
                    key={partner.id}
                    onPress={() => handlePartnerSurvey(partner)}
                    className="flex-row items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <View className="relative">
                      <Image source={{ uri: partner.avatar }} className="w-14 h-14 rounded-full" />
                      <View
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          partner.isOnline ? "bg-success" : "bg-gray-400"
                        }`}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-secondary-dark">{partner.name}</Text>
                      <Text className="text-secondary text-sm">{partner.relationship}</Text>
                      <Text className="text-xs text-secondary">
                        {partner.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                      </Text>
                    </View>
                    <ArrowRight size={18} color="#6C757D" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View className="bg-gray-50 rounded-xl p-6 items-center mb-4">
              <View className="bg-gray-200 rounded-full p-4 mb-3">
                <Users size={32} color="#6C757D" />
              </View>
              <Text className="text-secondary-dark font-medium mb-2 text-center">Bạn chưa kết nối với đối tác nào</Text>
              <Text className="text-secondary text-center text-sm mb-4">
                Kết nối với đối tác để mời họ cùng tham gia khảo sát và nhận kết quả chính xác hơn.
              </Text>
            </View>
          )}

          <CustomButton onPress={handleConnectPartner} variant="outline" className="border-primary">
            <View className="flex-row items-center">
              <Plus size={18} color="#E83E8C" />
              <Text className="text-primary font-medium ml-2">
                {connectedPartners.length > 0 ? "Thêm đối tác khác" : "Kết nối đối tác"}
              </Text>
            </View>
          </CustomButton>

          <View className="bg-info/5 rounded-xl p-3 mt-4">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-info rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Kết quả chính xác và khách quan</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-info rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Cả hai cùng tham gia trả lời</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default SurveyOptionsScreen
