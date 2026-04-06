import React, { useContext, useEffect, useMemo, useState, type ComponentType } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";
import AppTopBar from "../components/AppTopBar/AppTopBar";
import Header from "../components/Header/Header";
import { AppContext } from "../context/AppContext";
import { PRIVILEGE_CATEGORIES } from "../constants/privilegeCategories";
import { colors } from "../theme/colors";
import type { QuestionCategory } from "../types/sessionQuestion";

// Recharts + React 19: chart components typed loosely (same pattern as UserResults).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asChart = (C: unknown) => C as ComponentType<any>;
const RadarChartC = asChart(RadarChart);
const PolarGridC = asChart(PolarGrid);
const PolarAngleAxisC = asChart(PolarAngleAxis);
const PolarRadiusAxisC = asChart(PolarRadiusAxis);
const RadarC = asChart(Radar);
const LegendC = asChart(Legend);
const ResponsiveContainerC = asChart(ResponsiveContainer);

const CHART_YELLOW = "#E6C84A";
const BAR_ORANGE = colors.accentOrange;
const PARTICIPANT_TOTAL = 30;
const ANSWERED_COUNT = 15;

const RADAR_AXIS_ORDER: QuestionCategory[] = [
    "ability",
    "age",
    "class",
    "language",
    "gender",
    "race_ethnicity",
];

/** Mock average privilege levels (0–8) for the radar chart. */
const RADAR_SCORES_BY_CATEGORY: Record<QuestionCategory, number> = {
    ability: 5.2,
    age: 6.1,
    class: 4.4,
    language: 5.0,
    gender: 3.8,
    race_ethnicity: 5.6,
};

type MockQuestion = {
    category: QuestionCategory;
    categoryLabel: string;
    prompt: string;
    answerOptions: { label: string; pct: number }[];
};

const MOCK_QUESTIONS: MockQuestion[] = [
    {
        category: "gender",
        categoryLabel: "Gender privilege",
        prompt: "My opinions online are rarely dismissed because of my gender.",
        answerOptions: [
            { label: "Completely agree", pct: 12 },
            { label: "Somewhat agree", pct: 34 },
            { label: "Somewhat disagree", pct: 38 },
            { label: "Completely disagree", pct: 16 },
        ],
    },
    {
        category: "age",
        categoryLabel: "Age privilege",
        prompt: "I feel my age is rarely used to dismiss my ideas in group settings.",
        answerOptions: [
            { label: "Completely agree", pct: 22 },
            { label: "Somewhat agree", pct: 28 },
            { label: "Somewhat disagree", pct: 30 },
            { label: "Completely disagree", pct: 20 },
        ],
    },
    {
        category: "class",
        categoryLabel: "Class privilege",
        prompt: "I can access learning resources without worrying about cost.",
        answerOptions: [
            { label: "Completely agree", pct: 18 },
            { label: "Somewhat agree", pct: 40 },
            { label: "Somewhat disagree", pct: 28 },
            { label: "Completely disagree", pct: 14 },
        ],
    },
];

export type AdminViewLocationState = {
    sessionName: string;
};

function formatTimeLeft(ms: number): string {
    if (ms <= 0) {
        return "0 h 0 min 0 s";
    }
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h} h ${m} min ${s} s`;
}

const cardShell: React.CSSProperties = {
    background: colors.cardWhite,
    borderRadius: 18,
    boxShadow: colors.cardShadow,
    padding: 24,
    boxSizing: "border-box",
    textAlign: "left",
};

const tealRoundButton: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: colors.primaryButton,
    color: "#000",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const footerActionButton: React.CSSProperties = {
    padding: "14px 28px",
    borderRadius: 12,
    border: "none",
    background: colors.primaryButton,
    color: "#000",
    fontWeight: 700,
    fontSize: 22,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const AdminView: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { language, setLanguage } = useContext(AppContext);

    const state = location.state as AdminViewLocationState | undefined;
    const sessionName = state?.sessionName?.trim() || "New session";

    const [categoryFilter, setCategoryFilter] = useState<"all" | QuestionCategory>("all");
    const [questionIndex, setQuestionIndex] = useState(0);

    const filteredQuestions = useMemo(() => {
        if (categoryFilter === "all") {
            return MOCK_QUESTIONS;
        }
        return MOCK_QUESTIONS.filter((q) => q.category === categoryFilter);
    }, [categoryFilter]);

    useEffect(() => {
        setQuestionIndex(0);
    }, [categoryFilter]);

    const activeQuestion =
        filteredQuestions.length > 0
            ? filteredQuestions[Math.min(questionIndex, filteredQuestions.length - 1)]
            : MOCK_QUESTIONS[0];

    const [endsAt] = useState(() => Date.now() + (52 * 3600 + 40 * 60 + 10) * 1000);
    const [remainingMs, setRemainingMs] = useState(() => endsAt - Date.now());

    useEffect(() => {
        const id = window.setInterval(() => {
            setRemainingMs(Math.max(0, endsAt - Date.now()));
        }, 1000);
        return () => window.clearInterval(id);
    }, [endsAt]);

    const radarData = useMemo(
        () =>
            RADAR_AXIS_ORDER.map((id) => {
                const meta = PRIVILEGE_CATEGORIES.find((c) => c.id === id)!;
                return {
                    subject: meta.label,
                    score: RADAR_SCORES_BY_CATEGORY[id],
                };
            }),
        [],
    );

    const goPrev = () => {
        setQuestionIndex((i) => (filteredQuestions.length ? (i - 1 + filteredQuestions.length) % filteredQuestions.length : 0));
    };

    const goNext = () => {
        setQuestionIndex((i) => (filteredQuestions.length ? (i + 1) % filteredQuestions.length : 0));
    };

    const handleDownloadCsv = () => {
        const rows = [
            ["Session ID", sessionId ?? ""],
            ["Session name", sessionName],
            ["Participants", String(PARTICIPANT_TOTAL)],
            ["Question", activeQuestion.prompt],
            ...activeQuestion.answerOptions.map((o) => [o.label, `${o.pct}%`]),
        ];
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `session-${sessionId ?? "export"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!sessionId) {
        return <Navigate to="/MainView" replace />;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: colors.pageBackground,
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
                /Admin View
            </div>

            <AppTopBar language={language} onLanguageChange={setLanguage} />

            <main
                style={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 1160,
                    paddingTop: 80,
                    paddingBottom: 120,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxSizing: "border-box",
                }}
            >
                <Header title="Daily data privileges" />

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 16,
                        marginBottom: 28,
                        color: colors.darkText,
                    }}
                >
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
                        <div>Session {sessionId}</div>
                        <div style={{ fontWeight: 600 }}>&quot;{sessionName}&quot;</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginLeft: "auto" }}>
                        {PARTICIPANT_TOTAL} participants
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                        gap: 24,
                        alignItems: "stretch",
                    }}
                >
                    <section style={{ ...cardShell, display: "flex", flexDirection: "column", minHeight: 420 }}>
                        <div style={{ marginBottom: 16 }}>
                            <label htmlFor="admin-filter" style={{ fontSize: 14, fontWeight: 700, marginRight: 8 }}>
                                Filter
                            </label>
                            <select
                                id="admin-filter"
                                value={categoryFilter}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCategoryFilter(v === "all" ? "all" : (v as QuestionCategory));
                                }}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${colors.inputBorder}`,
                                    fontSize: 15,
                                    fontFamily: "inherit",
                                    fontWeight: 600,
                                    maxWidth: "100%",
                                }}
                            >
                                <option value="all">Category: All</option>
                                {PRIVILEGE_CATEGORIES.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        Category: {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 17, color: colors.darkText }}>
                            Question: {activeQuestion.prompt}
                        </p>
                        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#555" }}>
                            Category: {activeQuestion.categoryLabel}
                        </p>
                        <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 15 }}>
                            {ANSWERED_COUNT}/{PARTICIPANT_TOTAL} answers
                        </p>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                            {activeQuestion.answerOptions.map((row) => (
                                <div key={row.label}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: 15,
                                            fontWeight: 600,
                                            marginBottom: 4,
                                        }}
                                    >
                                        <span>{row.label}</span>
                                        <span>{row.pct}%</span>
                                    </div>
                                    <div
                                        style={{
                                            height: 14,
                                            background: "#eee",
                                            borderRadius: 7,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${row.pct}%`,
                                                height: "100%",
                                                background: BAR_ORANGE,
                                                borderRadius: 7,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 20,
                                marginTop: 24,
                            }}
                        >
                            <button type="button" style={tealRoundButton} onClick={goPrev} aria-label="Previous question">
                                ←
                            </button>
                            <button type="button" style={tealRoundButton} onClick={goNext} aria-label="Next question">
                                →
                            </button>
                        </div>
                    </section>

                    <section style={{ ...cardShell, minHeight: 420 }}>
                        <h2
                            style={{
                                margin: "0 0 8px",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: colors.darkText,
                            }}
                        >
                            Average privilege levels of {ANSWERED_COUNT} participants
                        </h2>
                        <div style={{ width: "100%", height: 360 }}>
                            <ResponsiveContainerC width="100%" height="100%">
                                <RadarChartC cx="50%" cy="52%" outerRadius="72%" data={radarData}>
                                    <PolarGridC stroke="#ccc" />
                                    <PolarAngleAxisC
                                        dataKey="subject"
                                        tick={{ fill: colors.darkText, fontSize: 12, fontWeight: 600 }}
                                    />
                                    <PolarRadiusAxisC
                                        angle={90}
                                        domain={[0, 8]}
                                        tickCount={5}
                                        tick={{ fill: "#666", fontSize: 11 }}
                                    />
                                    <RadarC
                                        name="Privilege level"
                                        dataKey="score"
                                        stroke={CHART_YELLOW}
                                        fill={CHART_YELLOW}
                                        fillOpacity={0.45}
                                        strokeWidth={2}
                                    />
                                    <LegendC
                                        verticalAlign="top"
                                        align="center"
                                        wrapperStyle={{ paddingBottom: 8 }}
                                        iconType="circle"
                                        iconSize={10}
                                        formatter={(value: string) => (
                                            <span style={{ color: colors.darkText, fontWeight: 600, fontSize: 14 }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </RadarChartC>
                            </ResponsiveContainerC>
                        </div>
                    </section>
                </div>
            </main>

            <footer
                style={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "16px 24px",
                    background: colors.pageBackground,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    maxWidth: 1160,
                    width: "100%",
                    margin: "0 auto",
                    boxSizing: "border-box",
                }}
            >
                <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: colors.darkText }}>
                    Session time left: {formatTimeLeft(remainingMs)}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button type="button" style={footerActionButton} onClick={handleDownloadCsv}>
                        Download CSV
                    </button>
                    <button
                        type="button"
                        style={footerActionButton}
                        onClick={() => navigate(`/admin/${sessionId}/ended`, { state: { sessionName } })}
                    >
                        End session
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AdminView;
