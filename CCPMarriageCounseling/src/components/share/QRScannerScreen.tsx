import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

export default function QRScannerScreen() {
  const navigation = useNavigation<any>();
  const [hasPermission, setHasPermission] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền Camera để quét mã QR.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể yêu cầu quyền truy cập Camera.');
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleMessage = (event: any) => {
    const data = event.nativeEvent.data;
    if (data) {
      navigation.navigate("JoinCoupleRoom", { scannedCode: data });
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>QR Scanner</title>
      <script src="https://unpkg.com/html5-qrcode"></script>
      <style>
        body { margin: 0; padding: 0; }
        #reader { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="reader"></div>
      <script>
        const qrScanner = new Html5Qrcode("reader");
        Html5Qrcode.getCameras().then(cameras => {
          if (cameras && cameras.length) {
            qrScanner.start(
              cameras[0].id,
              {
                fps: 10,
                qrbox: 250
              },
              qrCodeMessage => {
                window.ReactNativeWebView.postMessage(qrCodeMessage);
                qrScanner.stop();
              },
              error => {}
            );
          }
        });
      </script>
    </body>
    </html>
  `;

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}
