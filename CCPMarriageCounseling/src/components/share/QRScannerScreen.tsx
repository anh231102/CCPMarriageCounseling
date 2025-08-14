import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';

export default function QRScannerScreen({ onScanned, onCancel, context }: { onScanned?: (code: string) => void, onCancel?: () => void, context?: string }) {
  const navigation = useNavigation<any>();

  const handleMessage = (event: any) => {
    let code = "";
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "QR_SCANNED" && msg.data) {
        code = msg.data;
      }
    } catch {
      code = event.nativeEvent.data;
    }
    if (onScanned) {
      onScanned(code);
    } else {
      navigation.navigate("JoinCoupleRoom", { scannedCode: code });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: "https://v0-quet-qr-voi-web.vercel.app/" }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      />
      {onCancel && (
        <TouchableOpacity
          style={{ position: "absolute", top: 40, right: 20, backgroundColor: "#fff8", borderRadius: 24, padding: 10 }}
          onPress={onCancel}
        >
          <X size={28} color="#E83E8C" />
        </TouchableOpacity>
      )}
    </View>
  );
}