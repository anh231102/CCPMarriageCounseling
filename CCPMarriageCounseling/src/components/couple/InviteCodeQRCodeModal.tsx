import React from "react";
import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = {
  visible: boolean;
  onClose: () => void;
  inviteCode: string | null;
};

const InviteCodeQRCodeModal = ({ visible, onClose, inviteCode }: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose} // Bắt buộc cho Android
  >
    <View className="flex-1 justify-center items-center bg-black/40">
      <View className="bg-white rounded-lg p-6 items-center w-80">
        <Text className="text-lg font-semibold mb-4">Mã QR kết nối</Text>
        {inviteCode ? (
          <QRCode value={inviteCode} size={200} />
        ) : (
          <Text>Đang tạo mã...</Text>
        )}
        <Text className="text-secondary text-xs mt-4 text-center">
          Quét mã QR này để kết nối nhanh với bạn!
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="mt-6 bg-primary px-6 py-2 rounded"
        >
          <Text className="text-white">Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default InviteCodeQRCodeModal;