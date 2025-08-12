"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Search,
  Filter,
  ChevronDown,
  Heart,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react-native";
import coupleApi from "@/src/config/api/couple.api";
import { Couple } from "@/src/config/types/couple.type";

const LoveMapHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const [allLoveMaps, setAllLoveMaps] = useState<Couple[]>([]);
  const [loveMaps, setLoveMaps] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadLoveMaps();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allLoveMaps, searchQuery, sortOrder, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadLoveMaps = async () => {
    setLoading(true);
    try {
      const allHistory = await coupleApi.getCoupleHistory();
      const validLoveMaps = allHistory.filter((couple) => couple.status === 2);
      setAllLoveMaps(validLoveMaps);
    } catch (error) {
      console.error("Error loading love maps:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách bản đồ tình yêu");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allLoveMaps;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = allLoveMaps.filter((couple) => {
        const name1 = couple.member.fullname.toLowerCase();
        const name2 = couple.isVirtual
          ? (couple.virtualName || "").toLowerCase()
          : (couple.member1?.fullname || "").toLowerCase();
        return name1.includes(query) || name2.includes(query);
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createAt).getTime();
      const dateB = new Date(b.createAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const totalItems = sorted.length;
    const totalPagesCount = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(totalPagesCount);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sorted.slice(startIndex, endIndex);

    setLoveMaps(paginated);
  };

  const handleSortChange = (newSort: "newest" | "oldest") => {
    setSortOrder(newSort);
    setShowSortMenu(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLoveMapPress = (couple: Couple) => {
    navigation.navigate("LoveMap", { coupleId: couple.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  const renderSurveyBadges = (couple: Couple) => {
    const badges = [];

    if (couple.mbti) {
      badges.push({
        name: "MBTI",
        color: "#E83E8C",
        bg: "#FCE4EC",
      });
    }

    if (couple.disc) {
      badges.push({
        name: "DISC",
        color: "#007BFF",
        bg: "#E3F2FD",
      });
    }

    if (couple.loveLanguage) {
      badges.push({
        name: "Love Language",
        color: "#20C997",
        bg: "#E6FCF5",
      });
    }

    if (couple.bigFive) {
      badges.push({
        name: "Big Five",
        color: "#FFB400",
        bg: "#FFF3CD",
      });
    }

    return (
      <View className="flex-row flex-wrap justify-center gap-2 mb-3">
        {badges.map((badge, index) => (
          <View
            key={index}
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: badge.bg }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: badge.color }}
            >
              {badge.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLoveMapCard = (couple: Couple) => {
    const partner1 = couple.member;
    const partner2 = couple.isVirtual
      ? { fullname: couple.virtualName || "Đối tác ảo", avatar: couple.virtualAvatar }
      : couple.member1;

    return (
      <TouchableOpacity
        key={couple.id}
        onPress={() => handleLoveMapPress(couple)}
        className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="bg-primary/10 rounded-full p-2 mr-2">
              <Heart size={16} color="#E83E8C" />
            </View>
            <Text className="text-secondary text-sm">
              {getTimeAgo(couple.createAt)}
            </Text>
          </View>
          <View className="flex-row items-center">
            {couple.isVirtual && (
              <View className="bg-info/10 rounded-full px-2 py-1 mr-2">
                <Text className="text-info text-xs font-medium">Ảo</Text>
              </View>
            )}
            <View
              className={`rounded-full px-2 py-1 ${
                couple.isOwned ? "bg-primary/10" : "bg-secondary/10"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  couple.isOwned ? "text-primary" : "text-secondary"
                }`}
              >
                {couple.isOwned ? "Chủ sở hữu" : "Thành viên"}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 items-center">
            <Image
              source={{
                uri:
                  partner1.avatar || "https://placeholder.svg?height=50&width=50",
              }}
              className="w-12 h-12 rounded-full mb-2"
            />
            <Text className="text-secondary-dark font-medium text-center" numberOfLines={1}>
              {partner1.fullname}
            </Text>
          </View>
          <View className="mx-4">
            <Heart size={20} color="#E83E8C" fill="#E83E8C" />
          </View>
          <View className="flex-1 items-center">
            <Image
              source={{
                uri:
                  partner2?.avatar || "https://placeholder.svg?height=50&width=50",
              }}
              className="w-12 h-12 rounded-full mb-2"
            />
            <Text className="text-secondary-dark font-medium text-center" numberOfLines={1}>
              {partner2?.fullname || "Chưa có"}
            </Text>
          </View>
        </View>

        {renderSurveyBadges(couple)}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Calendar size={14} color="#6C757D" />
            <Text className="text-secondary text-xs ml-1">
              {formatDate(couple.createAt)}
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-primary text-sm font-medium">
              Xem chi tiết
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <View className="flex-row justify-center items-center mt-6 mb-8">
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg mr-2 ${
            currentPage === 1 ? "bg-gray-200" : "bg-primary"
          }`}
        >
          <ArrowLeft size={16} color={currentPage === 1 ? "#6C757D" : "#FFFFFF"} />
        </TouchableOpacity>

        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg mx-1 min-w-[40px] items-center ${
              currentPage === page ? "bg-primary" : "bg-gray-100"
            }`}
          >
            <Text className={`${currentPage === page ? "text-white" : "text-secondary-dark"} font-medium`}>
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg ml-2 ${
            currentPage === totalPages ? "bg-gray-200" : "bg-primary"
          }`}
        >
          <ArrowRight size={16} color={currentPage === totalPages ? "#6C757D" : "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 ">
      <View className="bg-primary p-6">
        <Text className="text-white/90">Xem lại các bản đồ tình yêu đã tạo</Text>
      </View>

      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row mb-3">
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-lg px-3 mr-3 border border-gray-200">
            <Search size={18} color="#6C757D" />
            <TextInput
              className="flex-1 p-2"
              placeholder="Tìm kiếm theo tên..."
              placeholderTextColor="#6C757D"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View className="relative">
            <TouchableOpacity
              onPress={() => setShowSortMenu(!showSortMenu)}
              className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
            >
              <Filter size={16} color="#6C757D" />
              <Text className="text-secondary ml-2 text-sm">
                {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
              </Text>
              <ChevronDown size={16} color="#6C757D" className="ml-1" />
            </TouchableOpacity>

            {showSortMenu && (
              <View className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
                <TouchableOpacity
                  onPress={() => handleSortChange("newest")}
                  className={`p-3 flex-row items-center ${
                    sortOrder === "newest" ? "bg-primary/5" : ""
                  }`}
                >
                  <TrendingDown
                    size={16}
                    color={sortOrder === "newest" ? "#E83E8C" : "#6C757D"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      sortOrder === "newest"
                        ? "text-primary font-medium"
                        : "text-secondary-dark"
                    }`}
                  >
                    Mới nhất
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSortChange("oldest")}
                  className={`p-3 flex-row items-center ${
                    sortOrder === "oldest" ? "bg-primary/5" : ""
                  }`}
                >
                  <TrendingUp
                    size={16}
                    color={sortOrder === "oldest" ? "#E83E8C" : "#6C757D"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      sortOrder === "oldest"
                        ? "text-primary font-medium"
                        : "text-secondary-dark"
                    }`}
                  >
                    Cũ nhất
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <Text className="text-secondary text-sm">
          {allLoveMaps.length} bản đồ tình yêu • Trang {currentPage}/{totalPages}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#E83E8C" />
            <Text className="text-secondary mt-2">Đang tải...</Text>
          </View>
        ) : loveMaps.length > 0 ? (
          <>
            {loveMaps.map(renderLoveMapCard)}
            {renderPagination()}
          </>
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <View className="bg-primary/10 rounded-full p-4 mb-4">
                <Heart size={32} color="#E83E8C" />
              </View>
              <Text className="text-secondary-dark font-bold text-lg mb-2">
                {searchQuery
                  ? "Không tìm thấy kết quả"
                  : "Chưa có bản đồ tình yêu"}
              </Text>
              <Text className="text-secondary text-center mb-4">
                {searchQuery
                  ? `Không tìm thấy bản đồ tình yêu nào với từ khóa "${searchQuery}"`
                  : "Bạn chưa tạo bản đồ tình yêu nào. Hãy bắt đầu với bộ khảo sát tổng hợp."}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("SurveyTab", { screen: "SurveyList" })
                  }
                  className="bg-primary rounded-lg px-6 py-3"
                >
                  <Text className="text-white font-medium">
                    Bắt đầu khảo sát
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LoveMapHistoryScreen;
