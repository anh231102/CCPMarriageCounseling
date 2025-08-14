import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Copy, Share2 } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { Share as RNShare } from "react-native";
import InviteCodeQRCodeModal from "./InviteCodeQRCodeModal";

type Props = {
  inviteCode: string | null;
};

const InviteCodeCard = ({ inviteCode }: Props) => {
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("Thành công", "Đã sao chép mã mời vào bộ nhớ tạm");
    } else {
      Alert.alert("Lỗi", "Không có mã mời để sao chép");
    }
  };

  const handleShare = async () => {
    if (!inviteCode) {
      Alert.alert("Lỗi", "Không có mã mời để chia sẻ.");
      return;
    }

    try {
      const message = `${inviteCode}`;
      await RNShare.share({
        message,
        title: "Mời bạn kết nối cặp đôi",
      });
    } catch (error) {
      console.log("Lỗi chia sẻ:", error);
    }
  };

  return (
    <>
      <View className="bg-gray-50 rounded-lg p-4 mb-4">
        <Text className="text-secondary-dark font-medium mb-2">Chia sẻ mã mời</Text>
        <View className="flex-row items-center">
          <View className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
            <Text className="text-secondary-dark text-center">
              {inviteCode ?? "Đang tạo mã..."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCopy}
            className="ml-2 bg-secondary/10 rounded-lg p-3"
            style={{ width: 50 }}
          >
            <Copy size={20} color="#6C757D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            className="ml-2 bg-secondary/10 rounded-lg p-3"
            style={{ width: 44 }}
          >
            <Share2 size={20} color="#6C757D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowQR(true)}
            className="ml-2 bg-secondary/10 rounded-lg p-3"
            style={{ width: 44 }}
          >
            <Text style={{ color: "#6C757D", fontWeight: "bold" }}>QR</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-secondary text-xs mt-2">
          Chia sẻ mã này với đối tác của bạn để họ có thể nhập vào ứng dụng và kết nối với bạn.
        </Text>
      </View>
      <InviteCodeQRCodeModal
        visible={showQR}
        onClose={() => setShowQR(false)}
        inviteCode={inviteCode}
      />
    </>
  );
};

export default InviteCodeCard;