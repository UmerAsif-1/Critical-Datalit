import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";
import JoinSessionCategoryIcons from "../components/JoinSessionCategoryIcons/JoinSessionCategoryIcons";
import { DEFAULT_QUIZ_ID } from "../constants/quiz";

export type JoinSessionLocationState = {
    sessionId: string;
    joinCode: string;
    playUrl: string;
    quizId: string;
    resumeFromQuestion: number;
};

const PLACEHOLDER_SESSION_ID = "00000000-0000-0000-0000-000000000001";

const DEV_JOIN_SESSION_PREVIEW: JoinSessionLocationState = {
    sessionId: PLACEHOLDER_SESSION_ID,
    joinCode: "000000",
    playUrl: `/session/${PLACEHOLDER_SESSION_ID}/questions`,
    quizId: DEFAULT_QUIZ_ID,
    resumeFromQuestion: 0,
};

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const TEAL_BUTTON = "#15B4A9";
const DARK_BLACK = "#222222";

const cardStyle: React.CSSProperties = {
    width: "min(480px, 92vw)",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    background: "#fff",
    textAlign: "left",
};

const JoinSession: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as JoinSessionLocationState | undefined;

    const [language, setLanguage] = useState<Language>("EN");

    const isDev = process.env.NODE_ENV === "development";
    const hasRealState = Boolean(state?.sessionId && state?.joinCode && state?.quizId);
    const effective = hasRealState ? state! : isDev ? DEV_JOIN_SESSION_PREVIEW : null;

    if (!effective) {
        return <Navigate to="/MainView" replace />;
    }

    const { joinCode } = effective;

    const startQuiz = () => {
        navigate(`/session/${effective.sessionId}/questions`, {
            state: { joinCode, quizId: effective.quizId, resumeFromQuestion: effective.resumeFromQuestion },
        });
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
                fontFamily: "'Montserrat', 'Lexend', sans-serif",
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
                /Join Session
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
                    paddingBottom: 48,
                    paddingLeft: 24,
                    paddingRight: 24,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <Header title="Daily data privileges" />

                <div
                    style={{
                        width: "min(480px, 92vw)",
                        marginBottom: 12,
                        alignSelf: "center",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: 18,
                            color: DARK_BLACK,
                            textAlign: "left",
                        }}
                    >
                        Session {joinCode}
                    </p>
                </div>

                <div style={cardStyle}>
                    <p
                        style={{
                            margin: 0,
                            marginBottom: 28,
                            fontSize: 18,
                            lineHeight: 1.5,
                            color: DARK_BLACK,
                            fontWeight: 700,
                        }}
                    >
                        In this session you will answer questions about data privilege and how it might affect you in
                        different categories of life:
                    </p>

                    <JoinSessionCategoryIcons />

                    <div style={{ textAlign: "center" }}>
                        <button
                            type="button"
                            onClick={startQuiz}
                            style={{
                                padding: "14px 36px",
                                borderRadius: 999,
                                border: "none",
                                color: "#000000",
                                fontWeight: 700,
                                fontSize: 22,
                                cursor: "pointer",
                                background: TEAL_BUTTON,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                fontFamily: "inherit",
                            }}
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinSession;
