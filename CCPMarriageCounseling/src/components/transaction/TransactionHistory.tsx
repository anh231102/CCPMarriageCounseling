"use client"

import { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    Modal,
} from "react-native"
// import DropDownPicker from "react-native-dropdown-picker"
import {
    Wallet,
    Gift,
    BookOpen,
    Users,
    ArrowDownLeft,
} from "lucide-react-native"
import {
    Transaction,
    TransactionType,
    getTransactionTypeLabel,
} from "@/src/config/types/transaction.type"
import transactionApi from "@/src/config/api/transaction.api"
import Loading from "../share/Loading"
import TransactionStatsModal from "./TransactionStatsModal"

// CustomPicker giống TransactionStatsModal
interface CustomPickerProps {
    label: string;
    options: { label: string; value: any }[];
    selectedValue: any;
    onValueChange: (value: any) => void;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ label, options, selectedValue, onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View className="mb-4">
            <Text className="text-gray-800 font-semibold mb-2">{label}</Text>
            <TouchableOpacity
                className="bg-gray-50 rounded-xl border border-gray-200 p-3"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-gray-900">{options.find(o => o.value === selectedValue)?.label || "Chọn"}</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-2xl w-11/12 max-h-80 overflow-hidden">
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value?.toString() ?? ""}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-200"
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-gray-900">{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            className="p-4 items-center"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-red-500 font-semibold">Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)

const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
        case TransactionType.BuyCourse:
            return <BookOpen size={20} color="#E83E8C" />
        case TransactionType.Booking:
        case TransactionType.CounselorEarn:
            return <Users size={20} color="#E83E8C" />
        case TransactionType.Withdraw:
        case TransactionType.BuyMembership:
            return <ArrowDownLeft size={20} color="#28A745" />
        case TransactionType.Refund100:
        case TransactionType.Refund50:
        case TransactionType.RefundCourse:
            return <Gift size={20} color="#28A745" />
        default:
            return <Wallet size={20} color="#6C757D" />
    }
}

const FILTER_OPTIONS: { label: string; value: TransactionType | null }[] = [
    { label: "Tất cả", value: null },
    { label: "Nạp tiền", value: TransactionType.Deposit },
    { label: "Thanh toán buổi tư vấn", value: TransactionType.Booking },
    { label: "Hoàn tiền 100%", value: TransactionType.Refund100 },
    { label: "Hoàn tiền 50%", value: TransactionType.Refund50 },
    { label: "Mua khóa học", value: TransactionType.BuyCourse },
    { label: "Mua membership", value: TransactionType.BuyMembership },
]

const TransactionHistory = () => {
    const [statsMode, setStatsMode] = useState<"month" | "year" | "all">("month")
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [stats, setStats] = useState<{ totalDeposit: number; totalSpent: number; count: number; list: Transaction[] } | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState<TransactionType | null>(null)
    const [statsLoading, setStatsLoading] = useState(false)

    useEffect(() => {
        fetchTransactions(1, filter ?? undefined)
    }, [filter])

    const fetchTransactions = async (pageNumber: number, type?: TransactionType) => {
        setLoading(true)
        try {
            const data = await transactionApi.getMyTransactions(type, pageNumber, 10)
            setTransactions(data.items)
            setPage(data.pageNumber)
            setTotalPages(data.totalPages)
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải lịch sử giao dịch")
        } finally {
            setLoading(false)
        }
    }

    const goToPreviousPage = () => {
        if (page > 1) {
            fetchTransactions(page - 1, filter ?? undefined)
        }
    }

    const goToNextPage = () => {
        if (page < totalPages) {
            fetchTransactions(page + 1, filter ?? undefined)
        }
    }

    return (
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-40 relative">
            <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm text-secondary-dark ">
                        Lọc theo loại giao dịch
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowStatsModal(true)}
                        className="px-4 py-2 bg-primary rounded-xl self-end"
                    >
                        <Text className="text-white font-bold">Xem thống kê</Text>
                    </TouchableOpacity>
                </View>

                <View className="">
                    <CustomPicker
                        label=""
                        options={FILTER_OPTIONS}
                        selectedValue={filter}
                        onValueChange={(val) => setFilter(val)}
                    />
                </View>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0">
                        <View className="bg-gray-50 rounded-full p-3 mr-4">
                            {getTransactionIcon(item.transactionType)}
                        </View>
                        <View className="flex-1">
                            <Text className="text-secondary-dark font-medium">
                                {getTransactionTypeLabel(item.transactionType)}
                            </Text>
                            <Text className="text-secondary text-xs">
                                {new Date(item.createDate).toLocaleString("vi-VN")}
                            </Text>
                            <Text className="text-secondary text-sm">
                                {item.description}
                            </Text>
                        </View>
                        <Text
                            className={`font-bold ml-2 ${item.amount > 0 ? "text-success" : "text-danger"}`}
                        >
                            {item.amount > 0 ? "+" : "-"}
                            {formatCurrency(Math.abs(item.amount))}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <Text className="text-secondary text-center py-4">
                            Không có giao dịch nào
                        </Text>
                    ) : null
                }
            />

            <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                    disabled={page <= 1 || loading}
                    onPress={goToPreviousPage}
                    className={`px-4 py-2 rounded-xl ${page <= 1 ? "bg-gray-200" : "bg-gray-100"}`}
                >
                    <Text className="text-primary">Trang trước</Text>
                </TouchableOpacity>

                <Text className="text-sm text-secondary self-center">
                    Trang {page} / {totalPages}
                </Text>

                <TouchableOpacity
                    disabled={page >= totalPages || loading}
                    onPress={goToNextPage}
                    className={`px-4 py-2 rounded-xl ${page >= totalPages ? "bg-gray-200" : "bg-gray-100"}`}
                >
                    <Text className="text-primary">Trang sau</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white/60 z-10 justify-center items-center">
                    <Loading size={40} />
                </View>
            )}

            <TransactionStatsModal
                visible={showStatsModal}
                onClose={() => setShowStatsModal(false)}
                statsMode={statsMode}
                setStatsMode={setStatsMode}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                stats={stats}
                loading={statsLoading}
                onFetchStats={async () => {
                    setStats(null)
                    setStatsLoading(true)
                    try {
                        const data = await transactionApi.getMyTransactions(undefined, 1, 1000)
                        const filtered = data.items.filter((item) => {
                            const d = new Date(item.createDate)
                            if (statsMode === "month") {
                                return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
                            }
                            if (statsMode === "year") {
                                return d.getFullYear() === selectedYear
                            }
                            return true
                        })
                        const totalDeposit = filtered.filter(i => i.amount > 0).reduce((sum, i) => sum + i.amount, 0)
                        const totalSpent = filtered.filter(i => i.amount < 0).reduce((sum, i) => sum + Math.abs(i.amount), 0)
                        setStats({ totalDeposit, totalSpent, count: filtered.length, list: filtered })
                    } catch (e) {
                        Alert.alert("Lỗi", "Không thể lấy thống kê")
                    } finally {
                        setStatsLoading(false)
                    }
                }}
            />
        </View>
    )
}

export default TransactionHistory