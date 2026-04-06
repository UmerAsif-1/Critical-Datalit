import React, { useContext, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
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
import { downloadElementAsPng } from "../utils/exportDomAsPng";

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

const RADAR_AXIS_ORDER: QuestionCategory[] = [
    "ability",
    "age",
    "class",
    "language",
    "gender",
    "race_ethnicity",
];

const RADAR_SCORES_BY_CATEGORY: Record<QuestionCategory, number> = {
    ability: 5.2,
    age: 6.1,
    class: 4.4,
    language: 5.0,
    gender: 3.8,
    race_ethnicity: 5.6,
};

export type AdminSessionEndedLocationState = {
    sessionName: string;
};

function formatDeleteCountdown(ms: number): string {
    if (ms <= 0) {
        return "0 h 0 min 0 s";
    }
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h} h ${m} min ${s} s`;
}

const actionButtonStyle: React.CSSProperties = {
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

const AdminSessionEnded: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { language, setLanguage } = useContext(AppContext);
    const chartWrapRef = useRef<HTMLDivElement>(null);

    const state = location.state as AdminSessionEndedLocationState | undefined;
    const sessionName = state?.sessionName?.trim() || "New session";

    const [deleteDeadline] = useState(() => Date.now() + (26 * 3600 + 23 * 60 + 29) * 1000);
    const [remainingMs, setRemainingMs] = useState(() => deleteDeadline - Date.now());

    useEffect(() => {
        const id = window.setInterval(() => {
            setRemainingMs(Math.max(0, deleteDeadline - Date.now()));
        }, 1000);
        return () => window.clearInterval(id);
    }, [deleteDeadline]);

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

    const handleDownloadCsv = (): void => {
        const rows = [
            ["Session ID", sessionId ?? ""],
            ["Session name", sessionName],
            ["Status", "ended"],
            ...radarData.map((r) => [`Privilege — ${r.subject}`, String(r.score)]),
        ];
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `session-${sessionId ?? "export"}-ended.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadImage = (): void => {
        const card = chartWrapRef.current;
        if (!card) {
            return;
        }
        void downloadElementAsPng(card, `session-${sessionId ?? "chart"}-privilege-levels.png`);
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
                /Session ended (admin)
            </div>

            <AppTopBar language={language} onLanguageChange={setLanguage} />

            <main
                style={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 640,
                    paddingTop: 80,
                    paddingBottom: 48,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Header title="Daily data privileges" />

                <p
                    style={{
                        margin: "0 0 20px",
                        fontWeight: 700,
                        fontSize: 18,
                        color: colors.darkText,
                        textAlign: "center",
                    }}
                >
                    Session {sessionId} has ended.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/MainView")}
                    style={{
                        padding: "14px 48px",
                        borderRadius: 999,
                        border: "none",
                        color: "#000000",
                        fontWeight: 700,
                        fontSize: 18,
                        cursor: "pointer",
                        background: colors.primaryButton,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        fontFamily: "inherit",
                        marginBottom: 32,
                    }}
                >
                    Home
                </button>

                <div
                    ref={chartWrapRef}
                    style={{
                        width: "100%",
                        padding: 28,
                        borderRadius: 18,
                        background: colors.cardWhite,
                        boxShadow: colors.cardShadow,
                        boxSizing: "border-box",
                        marginBottom: 24,
                    }}
                >
                    <div style={{ width: "100%", height: 420 }}>
                        <ResponsiveContainerC width="100%" height="100%">
                            <RadarChartC cx="50%" cy="52%" outerRadius="72%" data={radarData}>
                                <PolarGridC stroke="#ccc" />
                                <PolarAngleAxisC
                                    dataKey="subject"
                                    tick={{ fill: colors.darkText, fontSize: 13, fontWeight: 600 }}
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
                                    wrapperStyle={{ paddingBottom: 12 }}
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
                </div>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        justifyContent: "center",
                        marginBottom: 28,
                    }}
                >
                    <button type="button" style={actionButtonStyle} onClick={handleDownloadCsv}>
                        Download CSV
                    </button>
                    <button type="button" style={actionButtonStyle} onClick={handleDownloadImage}>
                        Download image
                    </button>
                </div>

                <p
                    style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 18,
                        color: colors.darkText,
                        textAlign: "center",
                    }}
                >
                    Results will be deleted in: {formatDeleteCountdown(remainingMs)}
                </p>
            </main>
        </div>
    );
};

export default AdminSessionEnded;
