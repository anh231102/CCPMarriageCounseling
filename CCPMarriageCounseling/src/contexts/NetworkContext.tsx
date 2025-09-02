import React, { createContext, useEffect, useState, ReactNode } from "react";
import NetInfo from "@react-native-community/netinfo";

export const NetworkContext = createContext<{ isConnected: boolean; isPoorConnection: boolean }>({
  isConnected: true,
  isPoorConnection: false,
});

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isPoorConnection, setIsPoorConnection] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
      // Đánh giá mạng yếu dựa trên type hoặc details
      setIsPoorConnection(
        state.type === "cellular" && state.details && state.details.cellularGeneration === "2g"
      );
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isPoorConnection }}>
      {children}
    </NetworkContext.Provider>
  );
};