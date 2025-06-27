"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native"
import {
  Wallet,
  Plus,
  Eye,
  EyeOff,
  ArrowDownLeft,
  BookOpen,
  Users,
  Gift,
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react-native"
import CustomButton from "../../components/CustomButton"
import accountApi from "@/src/config/api/account.api"
import TransactionHistory from "@/src/components/transaction/TransactionHistory"
import { useNavigation } from "@react-navigation/native"

const MyWalletScreen = () => {
  const navigation = useNavigation<any>()
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("momo")
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(true)

  

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  const paymentMethods = [
    { id: "momo", name: "Ví MoMo", icon: "📱", fee: 0 },
    { id: "bank", name: "Chuyển khoản ngân hàng", icon: "🏦", fee: 0 },
    { id: "card", name: "Thẻ tín dụng", icon: "💳", fee: 2.5 },
  ]

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const data = await accountApi.getWalletBalance()
        setWalletBalance(data.remaining)
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy số dư ví")
      } finally {
        setLoadingBalance(false)
      }
    }
    fetchWalletBalance()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  

  const handleTopUp = () => {
    const amount =
      selectedAmount || Number.parseInt(customAmount.replace(/[^0-9]/g, "")) || 0
    if (amount < 10000) {
      Alert.alert("Lỗi", "Số tiền nạp tối thiểu là 10,000 VND")
      return
    }

    Alert.alert("Xác nhận nạp tiền", `Bạn muốn nạp ${formatCurrency(amount)} vào ví?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xác nhận",
        onPress: () => {
          setShowTopUpModal(false)
          Alert.alert("Thành công", "Nạp tiền thành công!")
          setSelectedAmount(null)
          setCustomAmount("")
        },
      },
    ])
  }
  const renderOverview = () => (
    <View>
      {/* Balance Card */}
      <View className="bg-primary rounded-2xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-medium">Số dư ví</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            {showBalance ? <Eye size={20} color="#FFFFFF" /> : <EyeOff size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-white text-3xl font-bold">
            {loadingBalance
              ? "Đang tải..."
              : showBalance
                ? formatCurrency(walletBalance ?? 0)
                : "••••••••"}
          </Text>
          <Text className="text-white/80 text-sm">Có thể sử dụng</Text>
        </View>

        <View className="flex-row justify-between">
          <CustomButton onPress={() => setShowTopUpModal(true)} className="bg-white/20 flex-1 mr-2 py-3">
            <View className="flex-row items-center justify-center">
              <Plus size={18} color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">Nạp tiền</Text>
            </View>
          </CustomButton>
          <CustomButton onPress={() => setActiveTab("history")} className="bg-white/20 flex-1 ml-2 py-3">
            <Text className="text-white font-medium">Lịch sử</Text>
          </CustomButton>
        </View>
      </View>

      {/* Stats */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-bold text-secondary-dark mb-4">Thống kê tháng này</Text>
        <View className="flex-row justify-between">
          <View className="flex-1 items-center">
            <View className="bg-success/10 rounded-full p-3 mb-2">
              <TrendingUp size={24} color="#28A745" />
            </View>
            {/* <Text className="text-success font-bold text-lg">{formatCurrency(walletData.totalTopUp)}</Text> */}
            <Text className="text-secondary text-sm">Đã nạp</Text>
          </View>
          <View className="w-px bg-border mx-4" />
          <View className="flex-1 items-center">
            <View className="bg-danger/10 rounded-full p-3 mb-2">
              <TrendingDown size={24} color="#DC3545" />
            </View>
            {/* <Text className="text-danger font-bold text-lg">{formatCurrency(walletData.totalSpent)}</Text> */}
            <Text className="text-secondary text-sm">Đã chi</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-bold text-secondary-dark mb-4">Thao tác nhanh</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity className="flex-1 items-center p-4 bg-primary/5 rounded-xl mr-2">
            <Text className="text-2xl mb-2">📚</Text>
            <Text className="text-primary font-medium text-center">Mua khóa học</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate("CounselorsTab", {
              screen: "CounselorList", 
            })
          } className="flex-1 items-center p-4 bg-primary/5 rounded-xl mx-2">
            <Text className="text-2xl mb-2">👨‍⚕️</Text>
            <Text className="text-primary font-medium text-center">Đặt tư vấn</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Recent Transactions */}

    </View>
  )

 

  const renderTopUpModal = () => (
    <Modal visible={showTopUpModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-secondary-dark">Nạp tiền vào ví</Text>
            <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
              <X size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Amount Selection */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-secondary-dark mb-4">Chọn số tiền</Text>
              <View className="flex-row flex-wrap mb-4">
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    onPress={() => {
                      setSelectedAmount(amount)
                      setCustomAmount("")
                    }}
                    className={`w-1/3 p-3 m-1 rounded-xl border ${selectedAmount === amount ? "border-primary bg-primary/10" : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    <Text
                      className={`text-center font-medium ${selectedAmount === amount ? "text-primary" : "text-secondary-dark"
                        }`}
                    >
                      {formatCurrency(amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="mb-4">
                <Text className="text-secondary-dark font-medium mb-2">Hoặc nhập số tiền khác</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-secondary-dark"
                  placeholder="Nhập số tiền"
                  value={customAmount}
                  onChangeText={(text) => {
                    setCustomAmount(text)
                    setSelectedAmount(null)
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Payment Methods */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-secondary-dark mb-4">Phương thức thanh toán</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  className={`flex-row items-center p-4 mb-3 rounded-xl border ${selectedMethod === method.id ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <Text className="text-xl mr-3">{method.icon}</Text>
                  <Text
                    className={`flex-1 font-medium ${selectedMethod === method.id ? "text-primary" : "text-secondary-dark"
                      }`}
                  >
                    {method.name}
                  </Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${selectedMethod === method.id ? "border-primary bg-primary" : "border-gray-300"
                      }`}
                  >
                    {selectedMethod === method.id && <View className="w-2 h-2 bg-white rounded-full m-auto" />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <CustomButton onPress={handleTopUp} className="mb-4">
              <Text className="text-white font-bold text-center">Nạp tiền</Text>
            </CustomButton>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tabs */}
      <View className="bg-white px-4 py-2 border-b border-border">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab("overview")}
            className={`flex-1 py-3 items-center border-b-2 ${activeTab === "overview" ? "border-primary" : "border-transparent"
              }`}
          >
            <Text className={`font-medium ${activeTab === "overview" ? "text-primary" : "text-secondary"}`}>
              Tổng quan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            className={`flex-1 py-3 items-center border-b-2 ${activeTab === "history" ? "border-primary" : "border-transparent"
              }`}
          >
            <Text className={`font-medium ${activeTab === "history" ? "text-primary" : "text-secondary"}`}>
              Lịch sử
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === "overview" ? (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {renderOverview()}
        </ScrollView>
      ) : (
        <View className="flex-1 ">
          
        <TransactionHistory />
        </View>
      )}


      {renderTopUpModal()}
    </View>
  )
}

export default MyWalletScreen
