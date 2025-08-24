import React, { useState, useRef } from "react";
import { View, ActivityIndicator, SafeAreaView, Platform, Modal, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CheckCircle, XCircle } from "lucide-react-native";

interface RouteParams {
  paymentUrl: string;
}

const PaymentWebView = () => {
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<null | "success" | "failure">(null);
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentUrl } = route.params as RouteParams;

  const handleNavigationChange = (navState: any) => {
    const { url } = navState;

    if (url.startsWith("https://v0-2-page-payment-website.vercel.app/success")) {
      setPaymentResult("success");
    } else if (url.startsWith("https://v0-2-page-payment-website.vercel.app/failure")) {
      setPaymentResult("failure");
    }
  };

  return (
    <>
      <Modal
  visible={!!paymentResult}
  transparent
  animationType="fade"
  onRequestClose={() => setPaymentResult(null)}
>
  <View
    style={{
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
    }}
  >
    <View
      style={{
        position: "absolute",
        bottom: "40%", // 2/3 từ trên xuống
        alignItems: "center",
        width: "100%",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#E83E8C",
          borderRadius: 24,
          paddingVertical: 18,
          paddingHorizontal: 60,
          alignItems: "center",
        }}
        onPress={() => {
          setPaymentResult(null);
          navigation.goBack();
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>Đóng</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1 }}
          mixedContentMode={Platform.OS === "android" ? "always" : "never"}
        />
      </SafeAreaView>
    </>
  );
};

export default PaymentWebView;