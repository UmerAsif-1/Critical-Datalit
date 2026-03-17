import React, { useState } from "react";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const TEAL_BUTTON = "#15B4A9";
const ORANGE_BUTTON = "#FF9400";
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
    const [sessionCode, setSessionCode] = useState("");
    const [language, setLanguage] = useState<Language>("EN");

    const joinSession = () => {
        console.log("Join", sessionCode);
    };

    const createSession = () => {
        console.log("Create");
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
            {/* Breadcrumb */}
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

            {/* Purple header bar */}
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

            {/* Main content: title + card, centered with top padding for header */}
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
                <Header title="Critical DataLit" />
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
                        onChange={(e) => setSessionCode(e.target.value)}
                        style={inputStyle}
                        placeholder="Enter 6-Digit Code"
                        maxLength={6}
                    />
                    <button
                        style={buttonStyle(TEAL_BUTTON)}
                        onClick={joinSession}
                    >
                        Join Session
                    </button>

                    <p
                        style={{
                            margin: "18px 0",
                            color: DARK_BLACK,
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >
                        or
                    </p>

                    <button
                        style={buttonStyle(ORANGE_BUTTON)}
                        onClick={createSession}
                    >
                        Create Session
                    </button>
                </div>
            </div>

            {/* Bottom decorative wavy*/}
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
                    {/* Yellowish back shape*/}
                    <path
                        d="M0,200 L0,50 C200,200 1000,200 1200,50 L1200,200 Z"
                        fill="#E6C84A"
                        opacity={0.5}
                    />
                    {/* Green */}
                    <path
                        d="M0,200 L0,50 Q420,60 840,200 L0,200 Z"
                        fill="#28C900"
                        opacity={0.36}
                    />
                    {/* Purple*/}
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
