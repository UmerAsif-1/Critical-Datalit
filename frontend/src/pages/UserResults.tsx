import React, { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
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
import Header from "../components/Header/Header";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import type { Language } from "../components/LanguageSwitcher/LanguageSwitcher";
import AccessibilityControls from "../components/AccessibilityControls/AccessibilityControls";
import InfoButton from "../components/InfoButton/InfoButton";
import { PRIVILEGE_CATEGORIES } from "../constants/privilegeCategories";
import type { QuestionCategory } from "../types/sessionQuestion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asChart = (C: unknown) => C as ComponentType<any>;
const RadarChartC = asChart(RadarChart);
const PolarGridC = asChart(PolarGrid);
const PolarAngleAxisC = asChart(PolarAngleAxis);
const PolarRadiusAxisC = asChart(PolarRadiusAxis);
const RadarC = asChart(Radar);
const LegendC = asChart(Legend);
const ResponsiveContainerC = asChart(ResponsiveContainer);

const HEADER_PURPLE = "#6500AD";
const LIGHT_PURPLE_BG = "#FDF9FF";
const TEAL_NAV = "#55ADA3";
const DARK_BLACK = "#222222";
const CHART_YELLOW = "#E6C84A";

const STORAGE_INFO_TEXT =
    "The results will be stored anonymously in the session database for maximum of 96 hours, after which they will be deleted.\n\nThe session admin can save the anonymous results to their computer before the 96 hour deadline.";

const RADAR_AXIS_ORDER: QuestionCategory[] = [
    "ability",
    "age",
    "class",
    "language",
    "gender",
    "race_ethnicity",
];

export type UserResultsLocationState = {
    joinCode?: string;
    scoresByCategory: Partial<Record<QuestionCategory, number>>;
};

const defaultScore = 5;

const UserResults: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as UserResultsLocationState | undefined;

    const [language, setLanguage] = useState<Language>("EN");
    const [storageInfoOpen, setStorageInfoOpen] = useState(false);
    const storageInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!storageInfoOpen) {
            return;
        }
        const close = (e: MouseEvent) => {
            if (storageInfoRef.current && !storageInfoRef.current.contains(e.target as Node)) {
                setStorageInfoOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [storageInfoOpen]);

    const chartData = useMemo(() => {
        const scores = state?.scoresByCategory ?? {};
        return RADAR_AXIS_ORDER.map((id) => {
            const meta = PRIVILEGE_CATEGORIES.find((c) => c.id === id)!;
            return {
                subject: meta.label,
                score: scores[id] ?? defaultScore,
            };
        });
    }, [state?.scoresByCategory]);

    if (!sessionId) {
        return <Navigate to="/MainView" replace />;
    }

    const homeButtonStyle: React.CSSProperties = {
        padding: "14px 48px",
        borderRadius: 999,
        border: "none",
        color: "#000000",
        fontWeight: 700,
        fontSize: 18,
        cursor: "pointer",
        background: TEAL_NAV,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontFamily: "inherit",
        marginBottom: 28,
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
                /User Results
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
                    width: "100%",
                    maxWidth: 640,
                    paddingTop: 80,
                    paddingBottom: 48,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxSizing: "border-box",
                }}
            >
                <Header title="Daily data privileges" />

                <button type="button" onClick={() => navigate("/MainView")} style={homeButtonStyle}>
                    Home
                </button>

                <p
                    style={{
                        margin: "0 0 32px",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        color: DARK_BLACK,
                        lineHeight: 1.5,
                    }}
                >
                    Thank you for your answers! Here are your results
                </p>

                <div style={{ width: "100%", height: 420, marginBottom: 40 }}>
                    <ResponsiveContainerC width="100%" height="100%">
                        <RadarChartC cx="50%" cy="52%" outerRadius="72%" data={chartData}>
                            <PolarGridC stroke="#ccc" />
                            <PolarAngleAxisC
                                dataKey="subject"
                                tick={{ fill: DARK_BLACK, fontSize: 13, fontWeight: 600 }}
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
                                    <span style={{ color: DARK_BLACK, fontWeight: 600, fontSize: 14 }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </RadarChartC>
                    </ResponsiveContainerC>
                </div>

                <div
                    ref={storageInfoRef}
                    style={{
                        display: "inline-flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setStorageInfoOpen((o) => !o)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: 16,
                            fontWeight: 600,
                            color: DARK_BLACK,
                            textDecoration: "underline",
                            textUnderlineOffset: 3,
                            padding: 0,
                        }}
                    >
                        How are these results stored
                    </button>
                    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                        {storageInfoOpen && (
                            <div
                                id="storage-results-info"
                                role="tooltip"
                                style={{
                                    position: "absolute",
                                    // Anchored to right of ?; shifted up.
                                    left: "100%",
                                    top: 0,
                                    transform: "translateY(calc(-100% - 12px))",
                                    marginLeft: 12,
                                    width: "min(340px, calc(100vw - 120px))",
                                    padding: "14px 16px",
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    lineHeight: 1.5,
                                    color: DARK_BLACK,
                                    textAlign: "left",
                                    zIndex: 200,
                                }}
                            >
                                {STORAGE_INFO_TEXT.split("\n\n").map((para, i) => (
                                    <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>
                                        {para}
                                    </p>
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setStorageInfoOpen((o) => !o)}
                            aria-label="How results are stored"
                            aria-expanded={storageInfoOpen}
                            aria-describedby={storageInfoOpen ? "storage-results-info" : undefined}
                            style={{
                                width: 32,
                                height: 28,
                                padding: 0,
                                borderRadius: 999,
                                border: "none",
                                background: TEAL_NAV,
                                color: "#000",
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "inherit",
                                flexShrink: 0,
                            }}
                        >
                            ?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserResults;
