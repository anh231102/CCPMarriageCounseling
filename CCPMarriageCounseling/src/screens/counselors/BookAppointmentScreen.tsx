"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Calendar,
  Clock,
  ArrowRight,
  Video,
} from "lucide-react-native";
import counselorApi from "@/src/config/api/counselor.api";
import type {
  AvailableScheduleData,
  TimeSlot,
} from "@/src/config/types/counselor.type";

const durations = [
  { id: 50, label: "50 phút" },
  { id: 110, label: "1 giờ 50 phút" },
  { id: 170, label: "2 giờ 50 phút" },
];

const BookAppointmentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { counselor } = route.params;

  const [scheduleData, setScheduleData] = useState<AvailableScheduleData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("video"); // Mặc định luôn chọn

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await counselorApi.postAvailableSchedule(counselor.id);
        setScheduleData(res);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải lịch khả dụng");
      }
    };

    fetchSchedule();
  }, []);

  const consultationType = {
    id: "video",
    name: "Video call",
    description: "Tư vấn qua Google Meet",
  };

  const getValidStartTimes = (slot: TimeSlot, duration: number | null) => {
    const startHour = parseInt(slot.start.split(":")[0]);
    const endHour = parseInt(slot.end.split(":")[0]);

    const times = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const totalMinutes = (endHour - hour) * 60;
      if (!duration || totalMinutes >= duration) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    }
    return times;
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedStartTime || !selectedType || !selectedDuration) {
      Alert.alert("Thông báo", "Vui lòng chọn đầy đủ thông tin lịch hẹn");
      return;
    }

    navigation.navigate("AppointmentConfirmation", {
      counselor,
      appointmentInfo: {
        date: {
          raw: selectedDate,
          formatted: formatDateWithDay(selectedDate),
        },
        time: {
          rawSlot: selectedSlot,
          startTime: selectedStartTime,
          duration: selectedDuration,
        },
        type: consultationType,
        totalPrice: counselor.price * (selectedDuration === 50 ? 1 : selectedDuration === 110 ? 2 : 3),
      },
    });
  };

  const currentDaySlots = scheduleData?.dailyAvailableSchedules.find(
    (d) => d.workDate === selectedDate
  );

  const validStartTimes = selectedSlot
    ? getValidStartTimes(selectedSlot, selectedDuration)
    : [];

  const formatDateWithDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const day = days[date.getDay()];
    const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    return `${day}, ${formatted}`;
  };

  useEffect(() => {
    if (selectedSlot && selectedDuration) {
      const times = getValidStartTimes(selectedSlot, selectedDuration);
      if (times.length === 0) {
        Alert.alert("Không có giờ phù hợp", "Vui lòng chọn thời lượng ngắn hơn");
        setSelectedStartTime(null);
      }
    }
  }, [selectedSlot, selectedDuration]);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
            <Calendar size={20} color="#E83E8C" />
          </View>
          <View>
            <Text className="text-xl font-bold text-secondary-dark">Đặt lịch tư vấn</Text>
            <Text className="text-secondary">với {counselor.fullname}</Text>
          </View>
        </View>

        {/* Chọn ngày */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {scheduleData?.dailyAvailableSchedules.map((d) => (
              <TouchableOpacity
                key={d.workDate}
                onPress={() => {
                  setSelectedDate(d.workDate);
                  setSelectedSlot(null);
                  setSelectedStartTime(null);
                }}
                className={`mr-3 p-3 rounded-lg min-w-[100px] items-center ${selectedDate === d.workDate ? "bg-primary" : "bg-gray-100"
                  }`}
              >
                <Text className={`font-medium ${selectedDate === d.workDate ? "text-white" : "text-secondary-dark"}`}>
                  {formatDateWithDay(d.workDate)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Thời lượng */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Thời lượng buổi tư vấn</Text>
          <View className="flex-row flex-wrap">
            {durations.map((d) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => {
                  setSelectedDuration(d.id);
                  setSelectedStartTime(null);
                }}
                className={`mr-2 mb-2 p-3 rounded-lg min-w-[120px] items-center ${selectedDuration === d.id ? "bg-primary" : "bg-gray-100"
                  }`}
              >
                <Text className={selectedDuration === d.id ? "text-white" : "text-secondary-dark"}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Khung giờ */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Khung giờ</Text>
          <View className="flex-row flex-wrap">
            {currentDaySlots?.availableSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedSlot(slot);
                  setSelectedStartTime(null);
                }}
                className={`mr-2 mb-2 p-3 rounded-lg min-w-[150px] items-center ${selectedSlot === slot ? "bg-primary" : "bg-gray-100"
                  }`}
              >
                <Text className={selectedSlot === slot ? "text-white" : "text-secondary-dark"}>
                  {slot.start} - {slot.end}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Giờ bắt đầu */}
        {selectedSlot && (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-secondary-dark mb-3">Chọn giờ bắt đầu</Text>
            <View className="flex-row flex-wrap">
              {validStartTimes.map((time, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedStartTime(time)}
                  className={`mr-2 mb-2 p-3 rounded-lg min-w-[100px] items-center ${selectedStartTime === time ? "bg-primary" : "bg-gray-100"
                    }`}
                >
                  <Text className={selectedStartTime === time ? "text-white" : "text-secondary-dark"}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Hình thức tư vấn (mặc định 1 loại, không cho chọn lại) */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold text-secondary-dark mb-3">Hình thức tư vấn</Text>
          <View className="mb-3 p-3 rounded-lg border border-primary bg-primary/5">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center bg-primary/10">
                <Video size={20} color="#E83E8C" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-medium text-primary">{consultationType.name}</Text>
                <Text className="text-secondary text-sm">{consultationType.description}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Phí tư vấn */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-secondary-dark">Phí tư vấn</Text>
            {selectedDuration ? (
              <Text className="text-primary font-bold text-lg">
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(counselor.price * (selectedDuration === 50 ? 1 : selectedDuration === 110 ? 2 : 3))}
              </Text>
            ) : (
              <Text className="text-secondary">Vui lòng chọn thời lượng</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          className="bg-[#E83E8C] rounded-full p-4 items-center flex-row justify-center mb-6"
        >
          <Text className="text-white font-bold text-lg mr-2">Tiếp tục</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookAppointmentScreen;
