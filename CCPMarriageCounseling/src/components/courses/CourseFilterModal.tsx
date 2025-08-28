"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native"
import {
  X,
  Star,
  DollarSign,
  BookOpen,
  RotateCcw,
  Check,
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { SubCategory } from "@/src/config/types/category.type"

interface FilterState {
  rating: number
  minPrice: number
  maxPrice: number
  subCategory: string | null
}

interface CourseFilterModalProps {
  visible: boolean
  onClose: () => void
  filter: FilterState
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>
  subCategories: SubCategory[]
}

export const CourseFilterModal: React.FC<CourseFilterModalProps> = ({
  visible,
  onClose,
  filter,
  setFilter,
  subCategories,
}) => {
  const { width } = Dimensions.get("window")
  const [slideAnim] = useState(new Animated.Value(width))

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }, [visible])

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN")
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
          {/* Nội dung modal - chặn sự kiện onPress */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: width * 0.85,
                padding: 24,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                transform: [{ translateX: slideAnim }],
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}>
                  Bộ lọc khóa học
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={{ padding: 8, borderRadius: 9999, backgroundColor: "#F3F4F6" }}
                  activeOpacity={0.7}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {/* Rating Filter */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                    <View style={{ backgroundColor: "#FEF3C7", padding: 8, borderRadius: 12, marginRight: 12 }}>
                      <Star size={20} color="#F59E0B" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
                      Đánh giá tối thiểu
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setFilter((f) => ({
                            ...f,
                            rating: star,
                          }))
                        }
                        activeOpacity={0.7}
                        style={{ marginRight: 8 }}
                      >
                        <Star
                          size={32}
                          color={star <= filter.rating ? "#F59E0B" : "#D1D5DB"}
                          fill={star <= filter.rating ? "#F59E0B" : "transparent"}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}>
                    Hiển thị khóa học có đánh giá từ {filter.rating} sao trở lên
                  </Text>
                </View>

                {/* Price Filter */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                    <View style={{ backgroundColor: "#ECFDF5", padding: 8, borderRadius: 12, marginRight: 12 }}>
                      <DollarSign size={20} color="#10B981" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
                      Khoảng giá
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    {/* Min Price */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "#4B5563", marginBottom: 8 }}>Giá tối thiểu</Text>
                      <View style={{ backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                        <TextInput
                          keyboardType="numeric"
                          value={filter.minPrice.toString()}
                          onChangeText={(val) =>
                            setFilter((f) => ({
                              ...f,
                              minPrice: Number(val) || 0,
                            }))
                          }
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          style={{ color: "#1F2937", fontSize: 16 }}
                        />
                      </View>
                    </View>

                    {/* Max Price */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, color: "#4B5563", marginBottom: 8 }}>Giá tối đa</Text>
                      <View style={{ backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
                        <TextInput
                          keyboardType="numeric"
                          value={filter.maxPrice.toString()}
                          onChangeText={(val) =>
                            setFilter((f) => ({
                              ...f,
                              maxPrice: Number(val) || 0,
                            }))
                          }
                          placeholder="2,000,000"
                          placeholderTextColor="#9CA3AF"
                          style={{ color: "#1F2937", fontSize: 16 }}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 12, padding: 12, marginTop: 16 }}>
                    <Text style={{ color: "#047857", fontSize: 14, textAlign: "center" }}>
                      Khoảng giá: {formatPrice(filter.minPrice)}đ - {formatPrice(filter.maxPrice)}đ
                    </Text>
                  </View>
                </View>

                {/* Subcategory Filter */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                    <View style={{ backgroundColor: "#EFF6FF", padding: 8, borderRadius: 12, marginRight: 12 }}>
                      <BookOpen size={20} color="#3B82F6" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
                      Chủ đề
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {subCategories.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        onPress={() =>
                          setFilter((f) => ({
                            ...f,
                            subCategory: f.subCategory === sub.id ? null : sub.id,
                          }))
                        }
                        activeOpacity={0.7}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 9999,
                          marginRight: 8,
                          marginBottom: 8,
                          borderWidth: 1,
                          backgroundColor: filter.subCategory === sub.id ? "#EC4899" : "#F9FAFB",
                          borderColor: filter.subCategory === sub.id ? "#EC4899" : "#E5E7EB",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {filter.subCategory === sub.id && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: filter.subCategory === sub.id ? "#fff" : "#374151",
                          }}
                        >
                          {sub.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={{ paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
                {/* Apply Button */}
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    marginBottom: 12,
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#E83E8C", "#FF6B9D"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ padding: 16, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                      Áp dụng bộ lọc
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Reset and Close Buttons */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() =>
                      setFilter({
                        minPrice: 0,
                        maxPrice: 2000000,
                        rating: 0,
                        subCategory: null,
                      })
                    }
                    style={{
                      flex: 1,
                      backgroundColor: "#F3F4F6",
                      borderRadius: 16,
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    activeOpacity={0.7}
                  >
                    <RotateCcw size={16} color="#6B7280" />
                    <Text style={{ color: "#374151", fontWeight: "600", marginLeft: 8 }}>
                      Đặt lại
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF1F2",
                      borderRadius: 16,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#FBCFE8",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#DB2777", fontWeight: "600" }}>Thoát</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
