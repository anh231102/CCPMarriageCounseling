"use client"
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { X, BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { Transaction, TransactionType } from "@/src/config/types/transaction.type"
import { getTransactionTypeLabel } from "@/src/config/types/transaction.type"


const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)

interface TransactionStatsModalProps {
    visible: boolean
    onClose: () => void
    statsMode: "month" | "year" | "all"
    setStatsMode: (mode: "month" | "year" | "all") => void
    selectedMonth: number
    setSelectedMonth: (month: number) => void
    selectedYear: number
    setSelectedYear: (year: number) => void
    stats: { totalDeposit: number; totalSpent: number; count: number; list: Transaction[] } | null
    loading: boolean
    onFetchStats: () => void
}



const TransactionStatsModal: React.FC<TransactionStatsModalProps> = ({
    visible,
    onClose,
    statsMode,
    setStatsMode,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    stats,
    loading,
    onFetchStats,

}) => {
    const [statsPage, setStatsPage] = useState(1);
    const pageSize = 5; // số giao dịch mỗi trang
    const pagedList = stats?.list.slice((statsPage - 1) * pageSize, statsPage * pageSize) || [];
    const totalPages = stats ? Math.ceil(stats.list.length / pageSize) : 1;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center px-4 h-auto">
                <View className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" style={{ maxHeight: 800 }}>
                    {/* Header */}
                    <LinearGradient
                        colors={["#E83E8C", "#FF6B9D"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="p-6 flex-row justify-between items-center"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-white/20 p-2 rounded-xl mr-3">
                                <BarChart3 size={24} color="#fff" />
                            </View>
                            <Text className="text-white text-xl font-bold">Thống kê giao dịch</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-white/20 p-2 rounded-full" activeOpacity={0.7}>
                            <X size={20} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {/* Content */}
                    <ScrollView className="p-6">
                        {/* Stats Mode Selection */}
                        <View className="mb-6">
                            <Text className="text-gray-800 font-semibold mb-3 text-base">Kiểu thống kê:</Text>
                            <View className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                                <Picker selectedValue={statsMode} onValueChange={setStatsMode} style={{ height: 50 }}>
                                    <Picker.Item label="Theo tháng/năm" value="month" />
                                    <Picker.Item label="Theo năm" value="year" />
                                    <Picker.Item label="Tất cả" value="all" />
                                </Picker>
                            </View>
                        </View>

                        {/* Month/Year Selection */}
                        {statsMode === "month" && (
                            <View className="mb-6">
                                <Text className="text-gray-800 font-semibold mb-3 text-base">Chọn thời gian:</Text>
                                <View className="flex-row space-x-3">
                                    <View className="flex-1">
                                        <Text className="text-gray-600 text-sm mb-2">Tháng:</Text>
                                        <View className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                            <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth} style={{ height: 50 }}>
                                                {[...Array(12)].map((_, i) => (
                                                    <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={i + 1} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-600 text-sm mb-2">Năm:</Text>
                                        <View className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                            <Picker selectedValue={selectedYear} onValueChange={setSelectedYear} style={{ height: 50 }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Picker.Item key={2022 + i} label={`${2022 + i}`} value={2022 + i} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {statsMode === "year" && (
                            <View className="mb-6">
                                <Text className="text-gray-800 font-semibold mb-3 text-base">Chọn năm:</Text>
                                <View className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                    <Picker selectedValue={selectedYear} onValueChange={setSelectedYear} style={{ height: 50 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Picker.Item key={2022 + i} label={`Năm ${2022 + i}`} value={2022 + i} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        )}

                        {/* Fetch Stats Button */}
                        <TouchableOpacity
                            className="rounded-2xl overflow-hidden shadow-md mb-6"
                            onPress={onFetchStats}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={loading ? ["#9CA3AF", "#6B7280"] : ["#E83E8C", "#FF6B9D"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="p-4 flex-row items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <ActivityIndicator color="#fff" size="small" className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Đang tải...</Text>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 size={20} color="#fff" className="mr-2" />
                                        <Text className="text-white font-bold text-lg">Xem thống kê</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Stats Display */}
                        {stats && (
                            <View className="space-y-4">
                                {/* Summary Cards */}
                                <View className="space-y-3">
                                    <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                                        <View className="flex-row items-center">
                                            <View className="bg-blue-100 p-2 rounded-xl mr-3">
                                                <Calendar size={20} color="#3B82F6" />
                                            </View>
                                            <View>
                                                <Text className="text-blue-800 font-semibold">Tổng số giao dịch</Text>
                                                <Text className="text-blue-600 text-2xl font-bold">{stats.count}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="bg-green-50 rounded-2xl p-4 border border-green-200">
                                        <View className="flex-row items-center">
                                            <View className="bg-green-100 p-2 rounded-xl mr-3">
                                                <TrendingUp size={20} color="#10B981" />
                                            </View>
                                            <View>
                                                <Text className="text-green-800 font-semibold">Tổng tiền nạp</Text>
                                                <Text className="text-green-600 text-xl font-bold">{formatCurrency(stats.totalDeposit)}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
                                        <View className="flex-row items-center">
                                            <View className="bg-red-100 p-2 rounded-xl mr-3">
                                                <TrendingDown size={20} color="#EF4444" />
                                            </View>
                                            <View>
                                                <Text className="text-red-800 font-semibold">Tổng tiền chi</Text>
                                                <Text className="text-red-600 text-xl font-bold">{formatCurrency(stats.totalSpent)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Transaction List */}
                                <View className="bg-gray-50 rounded-2xl p-4">

                                    <View className="bg-gray-50 rounded-2xl p-4">
                                        <Text className="text-gray-800 font-bold text-base mb-3">Danh sách giao dịch:</Text>
                                        {stats.list.length === 0 ? (
                                            <View className="items-center py-8">
                                                <DollarSign size={32} color="#9CA3AF" />
                                                <Text className="text-gray-500 mt-2">Không có giao dịch nào</Text>
                                            </View>
                                        ) : (
                                            <>
                                                {pagedList.map(item => (
                                                    <View key={item.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-200">
                                                        <View className="flex-row justify-between items-start">
                                                            <View className="flex-1 mr-3">
                                                                <Text className="text-gray-800 font-semibold text-sm mb-1">
                                                                    {getTransactionTypeLabel(item.transactionType)}
                                                                </Text>
                                                                <Text className="text-gray-500 text-xs mb-1">
                                                                    {new Date(item.createDate).toLocaleDateString("vi-VN")}
                                                                </Text>
                                                                <Text className="text-gray-600 text-xs" numberOfLines={2}>
                                                                    {item.description}
                                                                </Text>
                                                            </View>
                                                            <View className="items-end">
                                                                <Text
                                                                    className={`font-bold text-base ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                                                >
                                                                    {item.amount > 0 ? "+" : ""}
                                                                    {formatCurrency(item.amount)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                                {/* Paging controls */}
                                                <View className="flex-row justify-between items-center mt-2">
                                                    <TouchableOpacity
                                                        disabled={statsPage <= 1}
                                                        onPress={() => setStatsPage(statsPage - 1)}
                                                        className={`px-4 py-2 rounded-xl ${statsPage <= 1 ? "bg-gray-200" : "bg-gray-100"}`}
                                                    >
                                                        <Text className="text-primary">Trang trước</Text>
                                                    </TouchableOpacity>
                                                    <Text className="text-sm text-secondary self-center">
                                                        Trang {statsPage} / {totalPages}
                                                    </Text>
                                                    <TouchableOpacity
                                                        disabled={statsPage >= totalPages}
                                                        onPress={() => setStatsPage(statsPage + 1)}
                                                        className={`px-4 py-2 rounded-xl ${statsPage >= totalPages ? "bg-gray-200" : "bg-gray-100"}`}
                                                    >
                                                        <Text className="text-primary">Trang sau</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Close Button */}

                    </ScrollView>
                    <View className="p-2">
                        <TouchableOpacity
                            className="mt-6 mb-2  bg-gray-100 rounded-2xl p-4 items-center"
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text className="text-gray-700 font-semibold text-lg">Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default TransactionStatsModal
