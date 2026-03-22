import React, { useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const TEAL_BUTTON = "#15B4A9";
const DARK_BLACK = "#222222";
const CARD_BORDER_BLUE = "#2563eb";

const SAMPLE_QUESTION =
    "My opinions online are rarely dismissed because of my gender.";

const ANSWER_OPTIONS: { value: string; label: string }[] = [
    { value: "completely_agree", label: "Completely agree" },
    { value: "somewhat_agree", label: "Somewhat agree" },
    { value: "somewhat_disagree", label: "Somewhat disagree" },
    { value: "completely_disagree", label: "Completely disagree" },
];

export type QuestionsLocationState = {
    joinCode?: string;
};

const Questions: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const state = location.state as QuestionsLocationState | undefined;

    const [language, setLanguage] = useState<Language>("EN");
    const [selected, setSelected] = useState<string | null>(null);

    if (!sessionId) {
        return <Navigate to="/MainView" replace />;
    }

    const joinCode = state?.joinCode ?? "—";

    const saveAnswer = () => {
        if (!selected) return;
        // TODO: POST /api/game/submit-answer when backend is ready
        console.log("Save answer", { sessionId, selected });
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
                /Questions
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
                    paddingTop: 80,
                    paddingBottom: 120,
                    paddingLeft: 24,
                    paddingRight: 24,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <Header title="Critical DataLit" />

                <div
                    style={{
                        width: "min(520px, 94vw)",
                        marginBottom: 12,
                        alignSelf: "center",
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: 16,
                            color: DARK_BLACK,
                            textAlign: "left",
                        }}
                    >
                        Session {joinCode}
                    </p>
                </div>

                <div
                    style={{
                        width: "min(520px, 94vw)",
                        padding: 28,
                        borderRadius: 12,
                        background: "#fff",
                        border: `2px solid ${CARD_BORDER_BLUE}`,
                        boxSizing: "border-box",
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 24px 0",
                            fontSize: 18,
                            lineHeight: 1.5,
                            color: DARK_BLACK,
                            fontWeight: 600,
                        }}
                    >
                        {SAMPLE_QUESTION}
                    </p>

                    <div
                        role="radiogroup"
                        aria-label="Answer"
                        style={{ display: "flex", flexDirection: "column", gap: 14 }}
                    >
                        {ANSWER_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    cursor: "pointer",
                                    fontSize: 16,
                                    color: DARK_BLACK,
                                }}
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={opt.value}
                                    checked={selected === opt.value}
                                    onChange={() => setSelected(opt.value)}
                                    style={{ width: 18, height: 18, cursor: "pointer" }}
                                />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginTop: 28 }}>
                        <button
                            type="button"
                            onClick={saveAnswer}
                            disabled={!selected}
                            style={{
                                padding: "14px 40px",
                                borderRadius: 999,
                                border: "none",
                                color: "#000000",
                                fontWeight: 700,
                                fontSize: 20,
                                cursor: selected ? "pointer" : "not-allowed",
                                background: TEAL_BUTTON,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                fontFamily: "inherit",
                                opacity: selected ? 1 : 0.6,
                            }}
                        >
                            Save answer
                        </button>
                    </div>
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

export default Questions;
