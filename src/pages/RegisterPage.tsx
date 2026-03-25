import React, { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

interface Props {
  onNavigateLogin: () => void;
}

const RegisterPage: React.FC<Props> = ({ onNavigateLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${BASE_URL}/register`, { email, password });
      onNavigateLogin();
    } catch (e: any) {
      setError(e.response?.data?.detail || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>얼마나 카페인</h1>
        <p style={styles.subtitle}>회원가입</p>
        <input
          style={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleRegister} disabled={isLoading}>
          {isLoading ? "처리 중..." : "회원가입"}
        </button>
        <p style={styles.link}>
          이미 계정이 있으신가요?{" "}
          <span style={styles.linkText} onClick={onNavigateLogin}>
            로그인
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
};

export default RegisterPage;
