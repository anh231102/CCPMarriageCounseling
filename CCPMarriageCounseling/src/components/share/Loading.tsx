import React, { useEffect, useRef } from "react";
import { View, Animated, StyleProp, ViewStyle } from "react-native";

interface LoadingProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const Loading: React.FC<LoadingProps> = ({
  size = 100,
  color = "#E83E8C",
  style,
}) => {
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

  const defaultContainerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "",
  };

  return (
    <View style={[defaultContainerStyle, style]}>
      <Animated.Image
        source={require("../../../assets/images/ccp-logo.png")}
        style={{
          width: size,
          height: size,
          tintColor: color,
          transform: [{ scale: scaleValue }],
        }}
      />
    </View>
  );
};

export default Loading;
