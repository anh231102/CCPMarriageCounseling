"use client"
import { Modal, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native"
import { X, Info, Send, UserCheck } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

const InvitePartnerModal = ({
  visible,
  onClose,
  inviteCode,
  setInviteCode,
  loadingInvite,
  errorInvite,
  handleInvitePartner,
}: {
  visible: boolean
  onClose: () => void
  inviteCode: string
  setInviteCode: (v: string) => void
  loadingInvite: boolean
  errorInvite: string
  handleInvitePartner: () => void
}) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View className="flex-1 justify-center items-center bg-black/40 px-4">
      <View className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
        {/* Header with gradient */}
        <LinearGradient
          colors={["#E83E8C", "#FF6B9D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-6 flex-row justify-between items-center"
        >
          <View className="flex-row items-center">
            <UserCheck size={24} color="#fff" className="mr-3" />
            <Text className="text-white text-xl font-bold">Mời Đối Tác</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="bg-white/20 p-2 rounded-full" activeOpacity={0.7}>
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Modal Content */}
        <View className="p-6">
          {/* Instructions Guide */}
          <View className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <View className="flex-row items-center mb-3">
              <Info size={20} color="#3B82F6" className="mr-3" />
              <Text className="font-bold text-base text-blue-700 ml-2">Hướng dẫn lấy mã đối tác</Text>
            </View>
            <Text className="text-gray-700 mb-1 leading-5">1. Đăng nhập vào tài khoản của đối tác</Text>
            <Text className="text-gray-700 mb-1 leading-5">2. Chuyển đến mục "Thông tin cá nhân"</Text>
            <Text className="text-gray-700 leading-5">3. Tìm và sao chép mã ở phần "Chia sẻ mã mời"</Text>
          </View>

          {/* Input Field */}
          <Text className="font-semibold text-gray-800 mb-3 text-base">Hãy nhập mã của người bạn muốn mời:</Text>
          <View className="flex-row items-center mb-4">
            <TextInput
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Nhập mã đối tác của bạn bè..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-base focus:border-pink-300"
              editable={!loadingInvite}
            />
          </View>

          {/* Error Message */}
          {errorInvite ? <Text className="text-red-500 text-sm mb-4 text-center">{errorInvite}</Text> : null}

          {/* Action Buttons */}
          <View className="flex-row justify-end mt-4 space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-2xl overflow-hidden shadow-sm mr-2"
              disabled={loadingInvite}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#D1D5DB", "#E5E7EB"]} // Gray gradient for close
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4 items-center"
              >
                <Text className="text-gray-700 font-bold text-lg">Đóng</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleInvitePartner}
              className="flex-1 rounded-2xl overflow-hidden shadow-md"
              disabled={loadingInvite}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loadingInvite ? ["#9CA3AF", "#6B7280"] : ["#E83E8C", "#FF6B9D"]} // Pink gradient for confirm, gray for loading
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4 flex-row items-center justify-cente "
              >
                {loadingInvite ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" className="mr-2" />
                    <Text className="text-white font-bold text-lg">Đang gửi...</Text>
                  </>
                ) : (
                  <>
                    <Send size={20} color="#fff" className="mr-3" />
                    <Text className="text-white font-bold text-lg ml-2">Xác nhận</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </Modal>
)

export default InvitePartnerModal
