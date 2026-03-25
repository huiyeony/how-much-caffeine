import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";

type Page = "login" | "register" | "search";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [token, setToken] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  // 새로고침해도 로그인 유지
  useEffect(() => {
    const saved = localStorage.getItem("access_token");
    if (saved) {
      setToken(saved);
      setPage("search");
    }
  }, []);

  // 401 응답 시 자동 로그아웃
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          setToken("");
          setSessionExpired(true);
          setPage("login");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("access_token", token);
    setToken(token);
    setSessionExpired(false);
    setPage("search");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken("");
    setPage("login");
  };

  if (page === "register") {
    return <RegisterPage onNavigateLogin={() => setPage("login")} />;
  }
  if (page === "search") {
    return <SearchPage token={token} onLogout={handleLogout} />;
  }
  return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setPage("register")} sessionExpired={sessionExpired} />;
}

export default App;
