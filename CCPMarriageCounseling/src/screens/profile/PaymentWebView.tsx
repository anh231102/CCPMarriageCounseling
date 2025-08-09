import React, { useState, useRef } from "react";
import { View, ActivityIndicator, Alert, SafeAreaView, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";

interface RouteParams {
  paymentUrl: string;
}

const PaymentWebView = () => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentUrl } = route.params as RouteParams;

  const handleNavigationChange = (navState: any) => {
  const { url } = navState;

  if (url.startsWith("https://v0-2-page-payment-website.vercel.app/success")) {
  Alert.alert("Thanh toán thành công!");
  navigation.goBack();
} else if (url.startsWith("https://v0-2-page-payment-website.vercel.app/failure")) {
    Alert.alert("Thanh toán thất bại!");
    navigation.goBack();
  }
};

  return (
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
  );
};

export default PaymentWebView;
