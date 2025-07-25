"use client"

import { useRoute, useNavigation } from "@react-navigation/native"
import { useAuth } from "../../hooks/useAuth"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import { UserCircle, Users, ArrowRight, Plus, Heart, UserPlus } from "lucide-react-native"
import CustomButton from "../../components/CustomButton"

const SurveyOptionsScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { user } = useAuth()

  // ✅ Lấy danh sách khảo sát được chọn từ màn trước
  const { selectedSurveyIds } = route.params as { selectedSurveyIds: string[] }

  

  const handleSelfCheck = () => {
    navigation.navigate("SurveyQuestions", {
      selectedSurveyIds,
      userType: "self",
    })
  }

  const handleSelfCheckWithVirtualPerson = () => {
    navigation.navigate("SelfCheck", {
      selectedSurveyIds,
      userType: "virtual",
      isSurvey: true,
    })
  }

  const handlePartnerSurvey = (partner: any) => {
    navigation.navigate("SurveyQuestions", {
      selectedSurveyIds,
      userType: "authenticated",
      partnerId: partner.id,
      partnerName: partner.name,
    })
  }

  const handleConnectPartner = () => {
    navigation.navigate("CoupleConnection", { selectedSurveyIds, isSurvey: true, })
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

        {/* Option 1: Tự khảo sát */}
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

        {/* Option 2: Với nhân vật ảo */}
        {/* <TouchableOpacity
          onPress={handleSelfCheckWithVirtualPerson}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-primary"
        >
          <View className="flex-row items-center mb-4">
            <View className="bg-primary/10 rounded-full p-3 mr-4">
              <UserPlus size={28} color="#E83E8C" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-secondary-dark">Khảo sát với nhân vật ảo</Text>
              <Text className="text-primary text-sm font-medium">Khuyến nghị</Text>
            </View>
            <ArrowRight size={20} color="#E83E8C" />
          </View>
          <Text className="text-secondary mb-4">
            Bạn sẽ nhập thông tin của một nhân vật tưởng tượng và trả lời các câu hỏi dựa trên nhận định của bạn.
          </Text>
          <View className="bg-primary/5 rounded-xl p-3">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-success rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Khám phá sự tự phản chiếu</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-success rounded-full mr-2" />
              <Text className="text-sm text-secondary-dark font-medium">Không cần tài khoản đối tác</Text>
            </View>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleSelfCheckWithVirtualPerson} activeOpacity={0.9}>
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-primary">
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 rounded-full p-3 mr-4">
                <UserPlus size={28} color="#E83E8C" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-secondary-dark">Khảo sát với nhân vật ảo</Text>
                <Text className="text-primary text-sm font-medium">Khuyến Nghị</Text>
              </View>
            </View>

            <Text className="text-secondary mb-4">
              Bạn sẽ nhập thông tin của một nhân vật tưởng tượng và trả lời các câu hỏi dựa trên nhận định của bạn.
            </Text>

            

            
            <View className="bg-primary/5 rounded-xl p-3 mt-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-success rounded-full mr-2" />
                <Text className="text-sm text-secondary-dark font-medium">Khám phá sự tự phản chiếu</Text>
              </View>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-success rounded-full mr-2" />
                <Text className="text-sm text-secondary-dark font-medium">Không cần tài khoản đối tác</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Option 3: Mời đối tác khảo sát */}
        <TouchableOpacity
          onPress={handleConnectPartner}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-primary"
        >
          <View >
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 rounded-full p-3 mr-4">
                <Users size={28} color="#E83E8C" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-secondary-dark">Mời đối tác làm khảo sát</Text>
                <Text className="text-primary text-sm font-medium">Kết quả chính xác nhất</Text>
              </View>
            </View>



            <TouchableOpacity onPress={handleConnectPartner} className="border border-primary p-2 rounded-md">
              <View className="flex-row items-center">
                <Plus size={18} color="#E83E8C" />
                <Text className="text-primary font-medium ml-2">
                  Tạo phòng khảo sát
                </Text>
              </View>
            </TouchableOpacity>



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
          </View></TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default SurveyOptionsScreen
