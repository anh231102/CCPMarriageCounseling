import authApi from "@/src/config/api/auth.api";
import { DecodedToken, User } from "@/src/config/types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  isAuth: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  isLoading: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("access-token");
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          const userData: User = {
            id: decoded.memberId,
            name: decoded.sub,
            email: decoded.sub,
            avatar: decoded.avatar,
          };
          setUser(userData);
          setIsAuth(true);
        } catch (e) {
          console.error("Token lỗi", e);
          await AsyncStorage.removeItem("access-token");
          logout();
        }
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const token = await authApi.loginMember(email, password);
      await AsyncStorage.setItem("access-token", token);

      const decoded: DecodedToken = jwtDecode(token);
      const userData: User = {
        id: decoded.memberId,
        name: decoded.sub,
        email: decoded.sub,
        avatar: decoded.avatar,
      };
      setUser(userData);
      setIsAuth(true);

      console.log("Đăng nhập thành công. Token:", token);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      logout();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.registerMember({ email, password, fullName });

      if (res === 1) {
        await login(email, password);
      } else {
        throw new Error("Đăng ký không thành công");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access-token");
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
