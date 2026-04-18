import React, { useContext, useMemo, useRef, useState, type ComponentType } from "react";
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
import { downloadAdminSessionCsv } from "../services/api";
import type { EndSessionResults } from "../services/api";

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

export type AdminSessionEndedLocationState = {
    sessionName: string;
    endSessionResults: EndSessionResults | null;
};


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
    const endResults = state?.endSessionResults ?? null;
    const [csvBusy, setCsvBusy] = useState(false);
    const [csvError, setCsvError] = useState<string | null>(null);

    const expiresAtDisplay = useMemo(() => {
        const s = endResults?.session;
        if (!s?.createdAt || !s?.ttlHours) return null;
        const normalized = s.createdAt.includes("T") ? s.createdAt : s.createdAt.replace(" ", "T");
        const ms = Date.parse(normalized);
        if (isNaN(ms)) return null;
        return new Date(ms + s.ttlHours * 3600 * 1000).toLocaleString();
    }, [endResults]);

    const radarData = useMemo(() => {
        return RADAR_AXIS_ORDER.map((id) => {
            const meta = PRIVILEGE_CATEGORIES.find((c) => c.id === id)!;
            const score = endResults?.aggregate.averages[id] ?? 0;
            return { subject: meta.label, score };
        });
    }, [endResults]);

    const handleDownloadSummaryCsv = (): void => {
        const rows = [
            ["Session ID", sessionId ?? ""],
            ["Session name", sessionName],
            ["Participants", String(endResults?.participantCount ?? 0)],
            ["Completed", String(endResults?.completedCount ?? 0)],
            ["Incomplete", String(endResults?.incompleteCount ?? 0)],
            ["Status", "ended"],
            [],
            ["Category", "Average score (0–9)"],
            ...radarData.map((r) => [r.subject, String(r.score)]),
        ];
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `session-${sessionId ?? "export"}-summary.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadFullCsv = (): void => {
        if (!sessionId) return;
        setCsvBusy(true);
        setCsvError(null);
        void (async () => {
            try {
                await downloadAdminSessionCsv(sessionId, `session-${sessionId}-full`);
            } catch (e) {
                setCsvError(e instanceof Error ? e.message : "CSV download failed");
            } finally {
                setCsvBusy(false);
            }
        })();
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
                                    domain={[0, 9]}
                                    tickCount={4}
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
                        marginBottom: 12,
                    }}
                >
                    <button type="button" style={actionButtonStyle} onClick={handleDownloadSummaryCsv}>
                        Summary CSV
                    </button>
                    <button
                        type="button"
                        style={{ ...actionButtonStyle, opacity: csvBusy ? 0.6 : 1 }}
                        onClick={handleDownloadFullCsv}
                        disabled={csvBusy}
                    >
                        {csvBusy ? "…" : "Full CSV"}
                    </button>
                    <button type="button" style={actionButtonStyle} onClick={handleDownloadImage}>
                        Download image
                    </button>
                </div>

                {csvError && (
                    <p style={{ color: "#b00020", fontSize: 14, marginBottom: 12, textAlign: "center" }}>
                        {csvError}
                    </p>
                )}

                <p
                    style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 15,
                        color: colors.darkText,
                        textAlign: "center",
                    }}
                >
                    {expiresAtDisplay
                        ? `Full data available for download until ${expiresAtDisplay}.`
                        : "Session has ended."}
                </p>
            </main>
        </div>
    );
};

export default AdminSessionEnded;
