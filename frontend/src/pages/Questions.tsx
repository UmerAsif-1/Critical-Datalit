import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";
import QuestionCategoryBadge from "../components/QuestionCategoryBadge/QuestionCategoryBadge";
import { scoresFromSubmittedAnswers } from "../services/answerScoring";
import {
    PLACEHOLDER_SESSION_QUESTIONS,
    USE_REMOTE_SESSION_QUESTIONS,
    fetchSessionQuestions,
} from "../services/sessionQuestions";
import type { SessionQuestion } from "../types/sessionQuestion";
import type { UserResultsLocationState } from "./UserResults";

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const TEAL_NAV = "#55ADA3";
const DARK_BLACK = "#222222";
const PROGRESS_YELLOW = "#E6C84A";

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
    const navigate = useNavigate();
    const state = location.state as QuestionsLocationState | undefined;

    const [language, setLanguage] = useState<Language>("EN");
    const [questions, setQuestions] = useState<SessionQuestion[]>(() =>
        USE_REMOTE_SESSION_QUESTIONS ? [] : PLACEHOLDER_SESSION_QUESTIONS,
    );
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(USE_REMOTE_SESSION_QUESTIONS);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [completedQuestionIndices, setCompletedQuestionIndices] = useState<Set<number>>(
        () => new Set(),
    );

    useEffect(() => {
        if (!sessionId) {
            return;
        }
        setCurrentQuestionIndex(0);
        setAnswers({});
        setCompletedQuestionIndices(new Set());
        setLoadError(null);

        if (!USE_REMOTE_SESSION_QUESTIONS) {
            setQuestions(PLACEHOLDER_SESSION_QUESTIONS);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setQuestions([]);

        fetchSessionQuestions(sessionId)
            .then((list) => {
                setQuestions(list);
                setIsLoading(false);
            })
            .catch((err) => {
                setLoadError(err instanceof Error ? err.message : "Failed to load questions");
                setIsLoading(false);
            });
    }, [sessionId]);

    const totalQuestions = questions.length;
    const selected = answers[currentQuestionIndex] ?? null;
    const current = questions[currentQuestionIndex];

    const progressPercent = useMemo(
        () =>
            totalQuestions === 0
                ? 0
                : Math.round((completedQuestionIndices.size / totalQuestions) * 100),
        [completedQuestionIndices, totalQuestions],
    );

    if (!sessionId) {
        return <Navigate to="/MainView" replace />;
    }

    const joinCode = state?.joinCode ?? "—";

    const setSelected = (value: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: value }));
    };

    const isLastQuestion = totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1;

    const goNextOrSubmit = () => {
        if (!selected || !current) return;
        console.log("Save answer", {
            sessionId,
            questionId: current.id,
            category: current.category,
            selected,
        });

        setCompletedQuestionIndices((prev) => new Set(prev).add(currentQuestionIndex));

        if (!isLastQuestion) {
            setCurrentQuestionIndex((i) => i + 1);
            return;
        }

        const finalAnswers = { ...answers, [currentQuestionIndex]: selected };
        const scoresByCategory = scoresFromSubmittedAnswers(questions, finalAnswers);
        const resultsState: UserResultsLocationState = {
            joinCode: state?.joinCode,
            scoresByCategory,
        };
        navigate(`/session/${sessionId}/results`, { state: resultsState });
    };

    const goPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((i) => i - 1);
        } else {
            navigate(-1);
        }
    };

    const navButtonStyle = (enabled: boolean): React.CSSProperties => ({
        flex: 1,
        padding: "14px 20px",
        borderRadius: 12,
        border: "none",
        color: "#000000",
        fontWeight: 700,
        fontSize: 18,
        cursor: enabled ? "pointer" : "not-allowed",
        background: TEAL_NAV,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontFamily: "inherit",
        opacity: enabled ? 1 : 0.55,
    });

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
                        borderRadius: 16,
                        background: "#fff",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        boxSizing: "border-box",
                    }}
                >
                    {isLoading && (
                        <p style={{ margin: 0, textAlign: "center", color: DARK_BLACK }}>Loading…</p>
                    )}

                    {!isLoading && loadError && (
                        <p style={{ margin: 0, textAlign: "center", color: "#b00020" }}>{loadError}</p>
                    )}

                    {!isLoading && !loadError && totalQuestions === 0 && (
                        <p style={{ margin: 0, textAlign: "center", color: DARK_BLACK }}>
                            No questions for this session.
                        </p>
                    )}

                    {!isLoading && !loadError && current && (
                        <>
                            <div style={{ marginBottom: 24 }}>
                                <div
                                    style={{
                                        height: 8,
                                        background: "#E8E8E8",
                                        borderRadius: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${progressPercent}%`,
                                            height: "100%",
                                            background: PROGRESS_YELLOW,
                                            borderRadius: 4,
                                            transition: "width 0.2s ease",
                                        }}
                                    />
                                </div>
                                <p
                                    style={{
                                        margin: "10px 0 0",
                                        textAlign: "center",
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: DARK_BLACK,
                                    }}
                                >
                                    {progressPercent}%
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 20,
                                    marginBottom: 24,
                                    alignItems: "flex-start",
                                }}
                            >
                                <QuestionCategoryBadge category={current.category} />
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 18,
                                        lineHeight: 1.5,
                                        color: DARK_BLACK,
                                        fontWeight: 600,
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    {current.prompt}
                                </p>
                            </div>

                            <div
                                role="radiogroup"
                                aria-label="Answer"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                {ANSWER_OPTIONS.map((opt) => {
                                    const isSelected = selected === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            onClick={() => setSelected(opt.value)}
                                            style={{
                                                width: "min(100%, 360px)",
                                                padding: "14px 18px",
                                                borderRadius: 12,
                                                border: isSelected
                                                    ? `2px solid ${PROGRESS_YELLOW}`
                                                    : "1px solid #CFCFCF",
                                                background: "#fff",
                                                color: DARK_BLACK,
                                                fontSize: 16,
                                                fontWeight: 700,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                fontFamily: "inherit",
                                                boxSizing: "border-box",
                                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    marginTop: 28,
                                }}
                            >
                                <button type="button" onClick={goPrevious} style={navButtonStyle(true)}>
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={goNextOrSubmit}
                                    disabled={!selected}
                                    style={navButtonStyle(Boolean(selected))}
                                >
                                    {isLastQuestion ? "Submit" : "Next"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Questions;
