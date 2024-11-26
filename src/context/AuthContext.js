import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 사용

// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [token, setToken] = useState(null); // JWT 토큰
  const [userId, setUserId] = useState(null); // 사용자 ID
  const [userRole, setUserRole] = useState(null); // 사용자 역할
  const [userName, setUserName] = useState(null); // 사용자 이름

  // 로그인 처리 함수
  const onLogin = (token) => {
    setIsLoggedIn(true);
    setToken(token);

    // JWT 토큰에서 id, role, userName 추출
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.id);
    setUserRole(decodedToken.role);
    setUserName(decodedToken.name); // userName 추가

    // 로컬 스토리지에 저장 (브라우저 종료 후에도 유지)
    localStorage.setItem("token", token);
    localStorage.setItem("userId", decodedToken.id);
    localStorage.setItem("userRole", decodedToken.role);
    localStorage.setItem("userName", decodedToken.name); // userName 저장
  };

  // 로그아웃 처리 함수
  const onLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setUserName(null); // userName 초기화

    // 로컬 스토리지에서 제거
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName"); // userName 제거
  };

  // 페이지 리로드 시 로컬 스토리지에서 상태 복원
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    const savedUserRole = localStorage.getItem("userRole");
    const savedUserName = localStorage.getItem("userName");

    if (savedToken && savedUserId && savedUserRole && savedUserName) {
      setIsLoggedIn(true);
      setToken(savedToken);
      setUserId(savedUserId);
      setUserRole(savedUserRole);
      setUserName(savedUserName); // userName 복원
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userId,
        userRole,
        userName,
        setUserName,
        onLogin,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;