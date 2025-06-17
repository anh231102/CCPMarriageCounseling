import React from "react";
import { Image, ImageStyle } from "react-native";

interface LogoProps {
  size?: number;
  style?: ImageStyle;
}

const Logo: React.FC<LogoProps> = ({ size = 100, style }) => {
  return (
    <Image
      source={require("../../../assets/images/ccp-logo.png")}
      style={[
        {
          width: size,
          height: size,
          resizeMode: "contain",
          tintColor: "#E83E8C",
        },
        style,
      ]}
    />
  );
};

export default Logo;
