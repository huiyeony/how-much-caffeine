import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

interface SearchResult {
  answer: string;
}

// ✅ 점검 여부 플래그 — true 이면 점검 오버레이 표시
const IS_UNDER_MAINTENANCE = true;

const SearchPage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [userQuery, setUserQuery] = useState<string>("");
  const [answer, setAnswer] = useState<SearchResult>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (): Promise<void> => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    const currentQuery = searchText;
    setUserQuery(currentQuery);
    setSearchText("");
    setAnswer(undefined);

    try {
      const response = await axios.get<SearchResult>(
        `https://${process.env.REACT_APP_API_URL}/ask`,
        {
          params: { q: currentQuery },
          timeout: 0,
        },
      );
      setAnswer(response.data);
    } catch (error) {
      console.error("검색 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        maxWidth: isMobile ? "480px" : "100%",
        margin: "0 auto",
        height: "100dvh",
        minWidth: "480px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F9F4F4",
        position: "relative",
      }}
    >
      {/* ─── 서버 점검 오버레이 ─── */}
      {IS_UNDER_MAINTENANCE && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(249, 244, 244, 0.92)",
            backdropFilter: "blur(6px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "32px",
          }}
        >
          {/* 아이콘 */}
          <div style={{ fontSize: "56px", lineHeight: 1 }}>🔧</div>

          {/* 제목 */}
          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              textAlign: "center",
            }}
          >
            서버 점검 중입니다
          </p>

          {/* 설명 */}
          <p
            style={{
              fontSize: "15px",
              color: "#666",
              margin: 0,
              textAlign: "center",
              lineHeight: "1.7",
            }}
          >
            더 나은 서비스 제공을 위해 점검을 진행하고 있어요.
            <br />
            잠시 후 다시 이용해 주세요 😊
          </p>

          {/* 구분선 */}
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#FFB3B3",
              borderRadius: "9999px",
              marginTop: "4px",
            }}
          />

          {/* 예상 완료 문구 (필요 시 날짜/시간으로 교체) */}
          <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>
            빠른 시일 내에 복구될 예정입니다.
          </p>
        </div>
      )}
      {/* ─────────────────────────── */}

      {/* 고정 헤더 */}
      <header
        style={{
          padding: "20px 30px",
          backgroundColor: "#FFF0F0",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{ fontWeight: "bold", color: "#333", fontSize: "25px" }}
            >
              👋🏻 얼마나 카페인
            </span>
          </div>
          <span
            style={{
              color: "#606060",
              fontSize: "17px",
              textAlign: "center",
            }}
          >
            하루 400mg 이상의 카페인 섭취는 권장하지 않습니다!
          </span>
        </div>
      </header>

      {/* 결과 리스트 영역 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "#F9F4F4",
        }}
      >
        {userQuery && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <div
              style={{
                backgroundColor: "#4A90E2",
                color: "white",
                padding: "12px 18px",
                borderRadius: "18px 18px 2px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                maxWidth: "85%",
                lineHeight: "1.6",
                fontSize: "15px",
                wordBreak: "break-word",
              }}
            >
              {userQuery}
            </div>
          </div>
        )}

        {answer ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#888",
                marginBottom: "5px",
                marginLeft: "5px",
              }}
            >
              AI 분석 결과
            </span>
            <div
              style={{
                backgroundColor: "white",
                padding: "15px 20px",
                borderRadius: "2px 18px 18px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                maxWidth: "85%",
                lineHeight: "1.6",
                fontSize: "15px",
                color: "#2e2e2e",
                whiteSpace: "pre-wrap",
              }}
            >
              {answer.answer}
            </div>
          </div>
        ) : (
          !isLoading &&
          !userQuery && (
            <div
              style={{
                textAlign: "center",
                marginTop: "100px",
                color: "#626262",
                fontSize: "17px",
              }}
            >
              <p>궁금한 카페인 함량을 물어보세요.</p>
              <p style={{ fontSize: "17px", color: "#999", marginTop: "10px" }}>
                예: 메가커피 메가리카노 카페인 함량 알려줘 .
              </p>
            </div>
          )
        )}

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <p
              style={{ color: "#FF7E7E", fontSize: "16px", fontWeight: "bold" }}
            >
              데이터를 분석하고 있습니다. 잠시만 기다려주세요.
            </p>
          </div>
        )}
      </div>

      {/* 하단 고정 검색바 */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          borderTop: "1px solid #eee",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "8px 20px",
            border: "1px solid #dfe1e5",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              e.key === "Enter" && handleSearch();
            }}
            placeholder="음료 이름을 입력하세요..."
            style={{
              flex: 1,
              border: "none",
              background: "none",
              padding: "10px",
              outline: "none",
              fontSize: "16px",
              color: "#2e2e2e",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#4A90E2",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
