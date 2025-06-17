"use client";

import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  ArrowRight,
} from "lucide-react-native";

const BookAppointmentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { counselor } = route.params;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Giả lập dữ liệu ngày có sẵn (7 ngày tới)
  const availableDates = [
    { date: "2023-06-01", formatted: "01/06", day: "Thứ 5" },
    { date: "2023-06-02", formatted: "02/06", day: "Thứ 6" },
    { date: "2023-06-05", formatted: "05/06", day: "Thứ 2" },
    { date: "2023-06-06", formatted: "06/06", day: "Thứ 3" },
    { date: "2023-06-07", formatted: "07/06", day: "Thứ 4" },
    { date: "2023-06-08", formatted: "08/06", day: "Thứ 5" },
    { date: "2023-06-09", formatted: "09/06", day: "Thứ 6" },
  ];

  // Giả lập dữ liệu khung giờ có sẵn
  const availableTimes = [
    { id: "1", time: "09:00 - 10:00" },
    { id: "2", time: "10:30 - 11:30" },
    { id: "3", time: "13:30 - 14:30" },
    { id: "4", time: "15:00 - 16:00" },
    { id: "5", time: "16:30 - 17:30" },
  ];

  // Các loại buổi tư vấn
  const consultationTypes = [
    {
      id: "video",
      name: "Video call",
      icon: Video,
      description: "Tư vấn qua Google Meet",
    },
    {
      id: "phone",
      name: "Cuộc gọi thoại",
      icon: Phone,
      description: "Tư vấn qua điện thoại",
    },
    {
      id: "chat",
      name: "Nhắn tin",
      icon: MessageCircle,
      description: "Tư vấn qua tin nhắn",
    },
  ];

  const handleContinue = () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn đầy đủ ngày, giờ và hình thức tư vấn"
      );
      return;
    }

    // Tìm thông tin ngày và giờ đã chọn
    const dateInfo = availableDates.find((d) => d.date === selectedDate);
    const timeInfo = availableTimes.find((t) => t.id === selectedTime);
    const typeInfo = consultationTypes.find((t) => t.id === selectedType);

    navigation.navigate("AppointmentConfirmation", {
      counselor,
      appointmentInfo: {
        date: dateInfo,
        time: timeInfo,
        type: typeInfo,
        price: counselor.price,
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
            <Calendar size={20} color="#E83E8C" />
          </View>
          <View>
            <Text className="text-xl font-bold text-secondary-dark">
              Đặt lịch tư vấn
            </Text>
            <Text className="text-secondary">với {counselor.name}</Text>
          </View>
        </View>

        {/* Chọn ngày */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">
            Chọn ngày
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date.date}
                onPress={() => setSelectedDate(date.date)}
                className={`mr-3 p-3 rounded-lg ${
                  selectedDate === date.date ? "bg-primary" : "bg-gray-100"
                } min-w-[80px] items-center`}
              >
                <Text
                  className={`font-medium ${
                    selectedDate === date.date
                      ? "text-white"
                      : "text-secondary-dark"
                  }`}
                >
                  {date.day}
                </Text>
                <Text
                  className={`${
                    selectedDate === date.date ? "text-white" : "text-secondary"
                  }`}
                >
                  {date.formatted}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chọn giờ */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">
            Chọn giờ
          </Text>
          <View className="flex-row flex-wrap">
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time.id}
                onPress={() => setSelectedTime(time.id)}
                className={`mr-2 mb-2 p-3 rounded-lg ${
                  selectedTime === time.id ? "bg-primary" : "bg-gray-100"
                } min-w-[120px] items-center`}
              >
                <View className="flex-row items-center">
                  <Clock
                    size={16}
                    color={selectedTime === time.id ? "white" : "#6C757D"}
                    className="mr-2"
                  />
                  <Text
                    className={`${
                      selectedTime === time.id
                        ? "text-white"
                        : "text-secondary-dark"
                    }`}
                  >
                    {time.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chọn hình thức tư vấn */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">
            Hình thức tư vấn
          </Text>
          {consultationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`mb-3 p-3 rounded-lg border ${
                selectedType === type.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    selectedType === type.id ? "bg-primary/10" : "bg-gray-100"
                  }`}
                >
                  <type.icon
                    size={20}
                    color={selectedType === type.id ? "#E83E8C" : "#6C757D"}
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    className={`font-medium ${
                      selectedType === type.id
                        ? "text-primary"
                        : "text-secondary-dark"
                    }`}
                  >
                    {type.name}
                  </Text>
                  <Text className="text-secondary text-sm">
                    {type.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Thông tin giá */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-secondary-dark">
              Phí tư vấn
            </Text>
            <Text className="text-primary font-bold text-lg">
              {counselor.price}
            </Text>
          </View>
        </View>

     <TouchableOpacity
  onPress={handleContinue}
  className="bg-[#E83E8C] rounded-full p-4 items-center flex-row justify-center mb-6"
>
  <Text className="text-white font-bold text-lg mr-2">Tiếp tục</Text>
  <ArrowRight size={20} color="#E83E8C" />
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookAppointmentScreen;
