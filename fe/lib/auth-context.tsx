"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Hàm làm mới token
  const refreshToken = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Gửi refreshToken qua cookie
      });

      //   if (!response.ok) {
      //     throw new Error("Failed to refresh token");
      //   }
      setIsAuthenticated(true);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthenticated(false);
      router.push("/login"); // Chuyển hướng về login nếu refresh thất bại
    }
  };

  // Kiểm tra và làm mới token định kỳ
  useEffect(() => {
    // Làm mới ngay lần đầu tiên
    refreshToken();

    // Làm mới mỗi 14 phút (trước khi accessToken hết hạn 15 phút)
    const interval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000); // 14 phút

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
