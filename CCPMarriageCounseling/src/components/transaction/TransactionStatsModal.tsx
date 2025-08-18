"use client"
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { X, BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Transaction } from "@/src/config/types/transaction.type";
import { getTransactionTypeLabel } from "@/src/config/types/transaction.type";
import Loading from "../share/Loading";

// Format tiền tệ
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

// CustomPicker cho iOS/Android
interface CustomPickerProps {
  label: string;
  options: { label: string; value: any }[];
  selectedValue: any;
  onValueChange: (value: any) => void;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ label, options, selectedValue, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="mb-4 ">
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
              keyExtractor={(item) => item.value.toString()}
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

// Props chính
interface TransactionStatsModalProps {
  visible: boolean;
  onClose: () => void;
  statsMode: "month" | "year" | "all";
  setStatsMode: (mode: "month" | "year" | "all") => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  stats: { totalDeposit: number; totalSpent: number; count: number; list: Transaction[] } | null;
  loading: boolean;
  onFetchStats: () => void;
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
  const pageSize = 5;
  const pagedList = stats?.list.slice((statsPage - 1) * pageSize, statsPage * pageSize) || [];
  const totalPages = stats ? Math.ceil(stats.list.length / pageSize) : 1;

  useEffect(() => {
    if (visible && !stats && !loading) {
      onFetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" style={{ maxHeight: 800 }}>
          {/* Header */}
          <LinearGradient
            colors={["#E83E8C", "#FF6B9D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
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
            {/* Chọn kiểu thống kê */}
            <CustomPicker
              label="Kiểu thống kê"
              options={[
                { label: "Theo tháng/năm", value: "month" },
                { label: "Theo năm", value: "year" },
                { label: "Tất cả", value: "all" },
              ]}
              selectedValue={statsMode}
              onValueChange={setStatsMode}
            />

            {/* Chọn tháng/năm */}
            {statsMode === "month" && (
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <CustomPicker
                    label="Tháng"
                    options={[...Array(12)].map((_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))}
                    selectedValue={selectedMonth}
                    onValueChange={setSelectedMonth}
                  />
                </View>
                <View className="flex-1">
                  <CustomPicker
                    label="Năm"
                    options={[...Array(5)].map((_, i) => ({ label: `${2022 + i}`, value: 2022 + i }))}
                    selectedValue={selectedYear}
                    onValueChange={setSelectedYear}
                  />
                </View>
              </View>
            )}

            {statsMode === "year" && (
              <CustomPicker
                label="Chọn năm"
                options={[...Array(5)].map((_, i) => ({ label: `${2022 + i}`, value: 2022 + i }))}
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
              />
            )}

            {/* Nút xem thống kê */}
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
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <>
                    <View className="items-center justify-center w-full">
                      <Loading size={30} color="#fff" />
                      <Text className="text-white font-bold text-lg mt-2">Đang tải...</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <BarChart3 size={20} color="#fff" className="mr-2" />
                    <Text className="text-white font-bold text-lg">Xem thống kê</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Hiển thị stats */}
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
            )}
          </ScrollView>

          {/* Close Button */}
          <View className="p-2">
            <TouchableOpacity
              className="mt-6 mb-2 bg-gray-100 rounded-2xl p-4 items-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-semibold text-lg">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionStatsModal;
