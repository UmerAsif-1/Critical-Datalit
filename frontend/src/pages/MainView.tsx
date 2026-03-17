import React, { useState } from "react";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";

const cardStyle: React.CSSProperties = {
    width: 320,
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    background: "#fff",
    textAlign: "center",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 18,
    fontSize: 14,
    textAlign: "left",
    boxSizing: "border-box",
};

const buttonStyle = (bg: string): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    background: bg,
});

const dividerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    margin: "18px 0",
    color: "#888",
    fontSize: 12,
};

const lineStyle: React.CSSProperties = {
    flex: 1,
    height: 1,
    background: "#ddd",
};

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
                justifyContent: "center",
                padding: 24,
                background: "linear-gradient(135deg, #F4F6FF 0%, #FFF7E3 100%)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    background: "#F2EDE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <AccessibilityControls />
                <div style={{ display: "flex", alignItems: "center" }}>
                    <InfoButton />
                    <LanguageSwitcher selected={language} onChange={setLanguage} />
                </div>
            </div>

            <Header title="Critical DataLit" />
            <div style={cardStyle}>
                <p style={{ margin: 0, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>
                    Enter Session Code
                </p>
                <input
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    style={inputStyle}
                    placeholder="Enter 6‑Digit Code"
                    maxLength={6}
                />
                <button style={buttonStyle("#118e82")} onClick={joinSession}>
                    Join Session
                </button>

                <div style={dividerStyle}>
                    <span style={lineStyle} />
                    <span style={{ margin: "0 10px" }}>or</span>
                    <span style={lineStyle} />
                </div>

                <button style={buttonStyle("#d23b5c")} onClick={createSession}>
                    Create Session
                </button>
            </div>
        </div>
    );
};

export default MainView;