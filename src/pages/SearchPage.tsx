import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./SearchPage.css";

const BASE_URL = process.env.REACT_APP_API_URL;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chatspace {
  chatspace_id: string;
  title: string | null;
  created_at: string;
}

interface Props {
  token: string;
  onLogout: () => void;
}

const IS_UNDER_MAINTENANCE = false;

const SearchPage: React.FC<Props> = ({ token, onLogout }) => {
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatspaceId, setChatspaceId] = useState<string | null>(null);
  const [chatspaces, setChatspaces] = useState<Chatspace[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 앱 진입 시 채팅방 설정
  useEffect(() => {
    const initChatspace = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chatspaces`, { headers: authHeaders });
        if (res.data.length > 0) {
          // 가장 최근 채팅방 사용
          const id = res.data[0].chatspace_id;
          setChatspaceId(id);
          setChatspaces(res.data);
          // 이전 메시지 로드
          const chatRes = await axios.get(`${BASE_URL}/chatspaces/${id}/chats`, { headers: authHeaders });
          setMessages(chatRes.data.map((m: any) => ({ role: m.role, content: m.content })));
        } else {
          // 채팅방이 없으면 새로 생성
          const created = await axios.post(`${BASE_URL}/chatspaces`, {}, { headers: authHeaders });
          setChatspaceId(created.data.chatspace_id);
          setChatspaces([created.data]);
        }
      } catch {
        onLogout();
      }
    };
    initChatspace();
  }, []);

  const handleSelectChatspace = async (id: string) => {
    setChatspaceId(id);
    setIsSidebarOpen(false);
    try {
      const chatRes = await axios.get(`${BASE_URL}/chatspaces/${id}/chats`, { headers: authHeaders });
      setMessages(chatRes.data.map((m: any) => ({ role: m.role, content: m.content })));
    } catch {
      setMessages([]);
    }
  };

  const handleNewChatspace = async () => {
    try {
      const created = await axios.post(`${BASE_URL}/chatspaces`, {}, { headers: authHeaders });
      setChatspaceId(created.data.chatspace_id);
      setChatspaces((prev) => [created.data, ...prev]);
      setMessages([]);
      setIsSidebarOpen(false);
    } catch {
      // 생성 실패 시 무시
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim() || !chatspaceId) return;

    const currentQuery = searchText;
    setSearchText("");
    setMessages((prev) => [...prev, { role: "user", content: currentQuery }]);
    setIsLoading(true);

    try {
      const response = await axios.post<{ answer: string }>(
        `${BASE_URL}/chatspaces/${chatspaceId}/chats`,
        { content: currentQuery },
        { headers: authHeaders, timeout: 0 }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: response.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (IS_UNDER_MAINTENANCE) {
    return (
      <div style={{ textAlign: "center", marginTop: "200px", color: "#666" }}>
        <p style={{ fontSize: "22px", fontWeight: "bold" }}>🔧 서버 점검 중입니다</p>
        <p style={{ fontSize: "15px", marginTop: "12px" }}>빠른 시일 내에 복구될 예정입니다.</p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        />
      )}

      {/* 사이드바 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isSidebarOpen ? 0 : "-280px",
          width: "280px",
          height: "100%",
          background: "white",
          boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
          transition: "left 0.25s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <button
            onClick={handleNewChatspace}
            style={{
              width: "100%",
              padding: "10px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + 새 채팅
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {chatspaces.map((cs) => (
            <div
              key={cs.chatspace_id}
              onClick={() => handleSelectChatspace(cs.chatspace_id)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#333",
                background: cs.chatspace_id === chatspaceId ? "#eef5fd" : "transparent",
                borderLeft: cs.chatspace_id === chatspaceId ? "3px solid #4a90e2" : "3px solid transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {cs.title || "새 채팅"}
            </div>
          ))}
        </div>
      </div>

      <header className="header" style={{ position: "relative" }}>
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#555",
          }}
        >
          ☰
        </button>
        <h1>👋🏻 얼마나 카페인</h1>
        <p>하루 400mg 이상의 카페인 섭취는 권장하지 않습니다!</p>
        <button
          onClick={onLogout}
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#aaa",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          로그아웃
        </button>
      </header>

      <div className="messages">
        {messages.length === 0 && !isLoading && (
          <div className="empty">
            <p className="empty-title">궁금한 카페인 함량을 물어보세요.</p>
            <div className="usage">
              <div className="usage-item">
                <span className="usage-label">브랜드만</span>
                <span className="usage-desc">스타벅스 메뉴 카페인 알려줘</span>
              </div>
              <div className="usage-item">
                <span className="usage-label">브랜드 + 음료명</span>
                <span className="usage-desc">메가커피 메가리카노 카페인 얼마야?</span>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <div key={idx} className="msg-user">
              <div className="bubble">{msg.content}</div>
            </div>
          ) : (
            <div key={idx} className="msg-ai">
              <span className="label">AI 분석 결과</span>
              <div className="bubble">{msg.content}</div>
            </div>
          )
        )}

        {isLoading && <p className="loading">데이터를 분석하고 있습니다. 잠시만 기다려주세요.</p>}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-row">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="음료 이름을 입력하세요..."
          />
          <button onClick={handleSearch}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
