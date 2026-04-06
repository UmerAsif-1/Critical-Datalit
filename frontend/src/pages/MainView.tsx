import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";
import { colors } from "../theme/colors";
import { joinSessionRequest } from "../services/api";

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const DARK_BLACK = "#222222";

const cardStyle: React.CSSProperties = {
    width: 320,
    padding: 24,
    borderRadius: 16,
    fontSize: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    background: "#fff",
    textAlign: "center",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 15, 
    border: "1px solid #ddd",
    marginBottom: 18,
    fontSize: 14,
    textAlign: "left",
    boxSizing: "border-box",
};

const buttonStyle = (bg: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: "none",
    color: "#000000",
    fontWeight: 600,
    fontSize: 30,
    cursor: "pointer",
    background: bg,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
});

const MainView: React.FC = () => {
    const navigate = useNavigate();
    const [sessionCode, setSessionCode] = useState("");
    const [language, setLanguage] = useState<Language>("EN");
    const [joinError, setJoinError] = useState<string | null>(null);

    const joinSession = () => {
        const code = sessionCode.trim();
        if (!/^\d{6}$/.test(code)) {
            setJoinError("Enter a valid 6-digit code.");
            return;
        }
        setJoinError(null);
        void (async () => {
            try {
                const data = await joinSessionRequest(code);
                navigate("/join-session", {
                    state: {
                        sessionId: data.sessionId,
                        joinCode: code,
                        playUrl: data.playUrl,
                        quizId: data.quizId,
                    },
                });
            } catch (e) {
                setJoinError(e instanceof Error ? e.message : "Could not join session");
            }
        })();
    };

    const createSession = () => {
        navigate("/CreateSession");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: LIGHT_PURPLE_BG,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 8,
                    left: 24,
                    fontSize: 12,
                    color: "#666",
                }}
            >
                /Main Primary
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    background: HEADER_PURPLE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                }}
            >
                <AccessibilityControls variant="header" />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <InfoButton variant="header" />
                    <LanguageSwitcher
                        selected={language}
                        onChange={setLanguage}
                        variant="header"
                    />
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 80,
                    paddingBottom: 120,
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            >
                <Header title="Daily data privileges" />
                <div style={cardStyle}>
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            marginBottom: 10,
                            textAlign: "center",
                            color: DARK_BLACK,
                        }}
                    >
                        Enter Session Code
                    </p>
                    <input
                        value={sessionCode}
                        onChange={(e) => setSessionCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        style={inputStyle}
                        placeholder="Enter 6-Digit Code"
                        maxLength={6}
                        inputMode="numeric"
                    />
                    {joinError && (
                        <p style={{ color: "#c00", fontSize: 14, marginTop: 0, marginBottom: 12 }}>{joinError}</p>
                    )}
                    <button type="button" style={buttonStyle(colors.primaryButton)} onClick={joinSession}>
                        Join Session
                    </button>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "18px 0",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                flex: 1,
                                height: 1,
                                background: "#ddd",
                            }}
                        />
                        <span
                            style={{
                                color: DARK_BLACK,
                                fontSize: 24,
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            or
                        </span>
                        <span
                            style={{
                                flex: 1,
                                height: 1,
                                background: "#ddd",
                            }}
                        />
                    </div>

                    <button type="button" style={buttonStyle(colors.primaryButton)} onClick={createSession}>
                        Create Session
                    </button>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 200"
                    preserveAspectRatio="none"
                    style={{ display: "block" }}
                >
                    <path
                        d="M0,200 L0,50 C200,200 1000,200 1200,50 L1200,200 Z"
                        fill="#E6C84A"
                        opacity={0.5}
                    />
                    <path
                        d="M0,200 L0,50 Q420,60 840,200 L0,200 Z"
                        fill="#28C900"
                        opacity={0.36}
                    />
                    <path
                        d="M1200,200 L1200,50 Q840,60 360,200 L1200,200 Z"
                        fill="#6500AD"
                        opacity={0.36}
                    />
                </svg>
            </div>
        </div>
    );
};

export default MainView;
