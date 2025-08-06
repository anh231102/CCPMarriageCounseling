"use client"
import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import {
  Edit3,
  User,
  Phone,
  Calendar,
  Users,
  ChevronRight,
  Award,
  Heart,
  Brain,
  Target,
  Settings
} from "lucide-react-native"
import { useAuth } from "../../hooks/useAuth"
import memberApi from "@/src/config/api/member.api"
import { Member } from "@/src/config/types/member.type"
import Loading from "@/src/components/share/Loading"
import MyProfileComponent from "@/src/components/share/MyProfileComponent"
import InviteCodeCard from "@/src/components/couple/InviteCodeCard"

const convertDateToInput = (isoDate: string): string => {
  const date = new Date(isoDate)
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const ProfileViewScreen = () => {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [profile, setProfile] = useState<Partial<Member>>({})
  const [isLoading, setIsLoading] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      loadProfile()
    }
  }, [isFocused])


  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await memberApi.getMyProfile()
      setProfile(data)
    } catch (err: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }


  const handleSurveyDetail = (surveyId: string, result: string | null) => {
    if (!result) {
      Alert.alert(
        "Chưa có kết quả",
        "Bạn chưa thực hiện khảo sát này. Bạn có muốn thực hiện ngay không?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Thực hiện",
            onPress: () => navigation.navigate("PersonTypeResultDetail", { type: surveyId, memberId: profile.id }),
          },
        ]
      )
      return
    }

    navigation.navigate("PersonTypeResultDetail", {
      type: surveyId,
      memberId: profile.id,
    })
  }


  const ProfileInfoCard = ({
    icon,
    label,
    value,
    placeholder = "Chưa cập nhật"
  }: {
    icon: React.ReactNode
    label: string
    value?: string | null
    placeholder?: string
  }) => (
    <View className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0">
      <View className="w-10 items-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-500 mb-1">{label}</Text>
        <Text className="text-base text-gray-900 font-medium">
          {value || placeholder}
        </Text>
      </View>
    </View>
  )

  const SurveyCard = ({
    icon,
    title,
    description,
    result,
    onPress,
    color = "#3B82F6"
  }: {
    icon: React.ReactNode
    title: string
    description: string
    result: string | null
    onPress: () => void
    color?: string
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">{title}</Text>
          <Text className="text-sm text-gray-500 mb-2">{description}</Text>

          {result ? (
            <View className="flex-row items-center">
              <View
                className="px-3 py-1 rounded-full mr-2"
                style={{ backgroundColor: `${color}15` }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: color }}
                >
                  {result}
                </Text>
              </View>
              <Text className="text-xs text-gray-400">Nhấn để xem chi tiết</Text>
            </View>
          ) : (
            <Text className="text-sm text-orange-600 font-medium">
              Chưa thực hiện • Nhấn để bắt đầu
            </Text>
          )}
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <Loading size={50} />
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Avatar */}
      <View className="bg-white px-4 py-6 shadow-sm">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            {/* Avatar and Basic Info */}
            <View className="flex-row items-center">
              <View className="w-20 h-20 rounded-full border-4 border-white shadow-lg mr-4">
                <MyProfileComponent image />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  {profile.fullname || "Chưa cập nhật tên"}
                </Text>
                <Text className="text-gray-600 mb-1">
                  {profile.phone || "Chưa cập nhật SĐT"}
                </Text>

              </View>
            </View>

          </View>

          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-[#EC4899] px-4 py-2 rounded-lg flex-row items-center"


          >
            <Edit3 size={16} color="#FFFFFF" />
            <Text className="text-white font-medium ml-2">Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-3">
          <InviteCodeCard inviteCode={(user?.memberId || "").replace("Member_", "")} />
          
        </View>

      </View>

      <View className="p-4">
        {/* Personal Information */}
        <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">Thông tin cá nhân</Text>
          </View>

          <View className="px-4">
            <ProfileInfoCard
              icon={<User size={18} color="#EC4899" />}
              label="Họ và tên"
              value={profile.fullname}
            />

            <ProfileInfoCard
              icon={<Phone size={18} color="#EC4899" />}
              label="Số điện thoại"
              value={profile.phone}
            />

            <ProfileInfoCard
              icon={<Calendar size={18} color="#EC4899" />}
              label="Ngày sinh"
              value={profile.dob ? convertDateToInput(profile.dob) : null}
            />

            <ProfileInfoCard
              icon={<Users size={18} color="#EC4899" />}
              label="Giới tính"
              value={profile.gender}
            />
          </View>
        </View>

        {/* Survey Results Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Award size={24} color="#EC4899" />
            <Text className="text-xl font-bold text-gray-900 ml-2">
              Kết quả khảo sát
            </Text>
          </View>

          <SurveyCard
            icon={<Brain size={24} color="#8B5CF6" />}
            title="MBTI - Loại tính cách"
            description="16 loại tính cách Myers-Briggs"
            result={profile.mbti ?? null}
            onPress={() => handleSurveyDetail("SV001", profile.mbti ?? null)}
            color="#8B5CF6"
          />

          <SurveyCard
            icon={<Target size={24} color="#EF4444" />}
            title="DISC - Phong cách làm việc"
            description="Đánh giá hành vi và phong cách giao tiếp"
            result={profile.disc ?? null}
            onPress={() => handleSurveyDetail("SV002", profile.disc ?? null)}
            color="#EF4444"
          />

          <SurveyCard
            icon={<Heart size={24} color="#EC4899" />}
            title="Love Language - Ngôn ngữ tình yêu"
            description="5 cách thể hiện và nhận tình yêu"
            result={profile.loveLanguage ?? null}
            onPress={() => handleSurveyDetail("SV003", profile.loveLanguage ?? null)}
            color="#EC4899"
          />

          <SurveyCard
            icon={<Settings size={24} color="#10B981" />}
            title="Big Five - 5 nhân tố lớn"
            description="Đánh giá tính cách theo 5 chiều độ"
            result={profile.bigFive ?? null}
            onPress={() => handleSurveyDetail("SV004", profile.bigFive ?? null)}
            color="#10B981"
          />

        </View>

        {/* Completion Status */}
        <View className="bg-[#FDF2F8] rounded-xl p-4 border border-[#FBCFE8]">
          <View className="flex-row items-center mb-2">
            <Award size={20} color="#EC4899" />
            <Text className="text-lg font-bold text-[#EC4899] ml-2">
              Tiến độ hoàn thành
            </Text>
          </View>

          {(() => {
            const surveys = [profile.mbti, profile.disc, profile.loveLanguage, profile.bigFive]
            const completed = surveys.filter(Boolean).length
            const total = surveys.length
            const percentage = Math.round((completed / total) * 100)

            return (
              <View>
                <Text className="text-[#EC4899] mb-2">
                  {completed}/{total} khảo sát đã hoàn thành ({percentage}%)
                </Text>

                <View className="bg-[#FBCFE8] rounded-full h-2 mb-2">
                  <View
                    className="bg-[#EC4899] h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </View>

                {completed < total && (
                  <Text className="text-[#EC4899] text-sm">
                    Hoàn thành thêm {total - completed} khảo sát để có cái nhìn toàn diện về bản thân
                  </Text>
                )}
              </View>
            )
          })()}
        </View>

      </View>
    </ScrollView>
  )
}

export default ProfileViewScreen
