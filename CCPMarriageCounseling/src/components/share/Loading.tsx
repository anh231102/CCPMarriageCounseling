import React, { useEffect, useRef } from "react";
import { View, Animated, Image } from "react-native";
import Logo from "./Logo";

const Loading = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleValue]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Animated.Image
        source={require("../../../assets/images/ccp-logo.png")}
        style={{
          width: 100,
          height: 100,
          marginBottom: 20,
          tintColor: "#E83E8C",
          transform: [{ scale: scaleValue }],
        }}
      />
    </View>
  );
};

export default Loading;
