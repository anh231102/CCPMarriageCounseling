import React, { useContext } from "react";
import { NetworkContext } from "../../contexts/NetworkContext";
import { View, Text } from "react-native";

const NetworkStatusBanner = () => {
  const { isConnected, isPoorConnection } = useContext(NetworkContext);

  if (!isConnected) {
    return (
      <View style={{ backgroundColor: "#DC3545", padding: 8 }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Không có kết nối mạng</Text>
      </View>
    );
  }
  if (isPoorConnection) {
    return (
      <View style={{ backgroundColor: "#FFC107", padding: 8 }}>
        <Text style={{ color: "#333", textAlign: "center" }}>Kết nối mạng yếu</Text>
      </View>
    );
  }
  return null;
};

export default NetworkStatusBanner;