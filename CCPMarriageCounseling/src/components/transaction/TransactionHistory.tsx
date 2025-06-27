"use client"

import { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
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

const FILTER_OPTIONS: { label: string; value: TransactionType | null  }[] = [
    { label: "Tất cả", value: null },
    { label: "Tư vấn", value: TransactionType.Booking },
    { label: "Hoàn tiền 100%", value: TransactionType.Refund100 },
    { label: "Hoàn tiền 50%", value: TransactionType.Refund50 },
    { label: "Hoàn tiền khóa học", value: TransactionType.RefundCourse },
    { label: "Khóa học", value: TransactionType.BuyCourse },
    // { label: "Rút tiền", value: TransactionType.Withdraw },
    { label: "Mua membership", value: TransactionType.BuyMembership },
    // { label: "Tư vấn viên nhận tiền", value: TransactionType.CounselorEarn },
]

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
   const [filter, setFilter] = useState<TransactionType | null>(null)


    useEffect(() => {
    fetchTransactions(1, filter ?? undefined)
}, [filter])


    const fetchTransactions = async (
        pageNumber: number,
        type?: TransactionType
    ) => {
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
            {/* Dropdown Filter */}
            <View className="mb-4">
                <Text className="text-sm text-secondary-dark mb-1">
                    Lọc theo loại giao dịch
                </Text>
                <View className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <Picker
                        selectedValue={filter}
                        onValueChange={(itemValue) => setFilter(itemValue)}
                        style={{ height: 48 }}
                    >
                        {FILTER_OPTIONS.map((option) => (
                            <Picker.Item
                                key={option.label}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
           
            {/* Transaction List */}
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
                            className={`font-bold ml-2 ${item.amount > 0 ? "text-success" : "text-danger"
                                }`}
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

            {/* Pagination Controls */}
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                    disabled={page <= 1 || loading}
                    onPress={goToPreviousPage}
                    className={`px-4 py-2 rounded-xl ${page <= 1 ? "bg-gray-200" : "bg-gray-100"
                        }`}
                >
                    <Text className="text-primary">Trang trước</Text>
                </TouchableOpacity>

                <Text className="text-sm text-secondary self-center">
                    Trang {page} / {totalPages}
                </Text>

                <TouchableOpacity
                    disabled={page >= totalPages || loading}
                    onPress={goToNextPage}
                    className={`px-4 py-2 rounded-xl ${page >= totalPages ? "bg-gray-200" : "bg-gray-100"
                        }`}
                >
                    <Text className="text-primary">Trang sau</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white/60 z-10 justify-center items-center">
                    <Loading size={40}  />
                </View>
            )}

        </View>
    )
}

export default TransactionHistory
