import React, { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

interface Props {
  onLogin: (token: string) => void;
  onNavigateRegister: () => void;
  sessionExpired?: boolean;
}

const LoginPage: React.FC<Props> = ({ onLogin, onNavigateRegister, sessionExpired }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      onLogin(res.data.access_token);
    } catch (e: any) {
      setError(e.response?.data?.detail || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/guest/login`);
      onLogin(res.data.access_token);
    } catch {
      setError("게스트 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>얼마나 카페인</h1>
        <p style={styles.subtitle}>로그인</p>
        {sessionExpired && (
          <p style={styles.expired}>세션이 만료되었습니다. 다시 로그인해주세요.</p>
        )}
        <input
          style={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
        <button style={styles.guestButton} onClick={handleGuestLogin} disabled={isLoading}>
          게스트로 시작하기
        </button>
        <p style={styles.link}>
          계정이 없으신가요?{" "}
          <span style={styles.linkText} onClick={onNavigateRegister}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100dvh",
    background: "#f9f4f4",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
    margin: "0 0 8px",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #dfe1e5",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },
  error: {
    color: "#e25555",
    fontSize: "13px",
    margin: 0,
    textAlign: "center",
  },
  button: {
    padding: "13px",
    background: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "4px",
  },
  link: {
    fontSize: "13px",
    color: "#888",
    textAlign: "center",
    margin: 0,
  },
  linkText: {
    color: "#4a90e2",
    cursor: "pointer",
    fontWeight: "bold",
  },
  expired: {
    background: "#fff4e5",
    color: "#e07000",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "8px",
    textAlign: "center",
    margin: 0,
  },
  guestButton: {
    padding: "13px",
    background: "white",
    color: "#888",
    border: "1px solid #dfe1e5",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default LoginPage;
