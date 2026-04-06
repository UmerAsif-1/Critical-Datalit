import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AppTopBar from "../components/AppTopBar/AppTopBar";
import Header from "../components/Header/Header";
import PageCard from "../components/PageCard/PageCard";
import LabeledInput from "../components/LabeledInput/LabeledInput";
import PrimaryFormButton from "../components/PrimaryFormButton/PrimaryFormButton";
import { colors } from "../theme/colors";
import type { AdminViewLocationState } from "./AdminView";

function generateSessionCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const createSessionColumnStyle: React.CSSProperties = {
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
};

const CreateSession: React.FC = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useContext(AppContext);
    const [sessionName, setSessionName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionName.trim()) {
            return;
        }
        const sessionId = generateSessionCode();
        const state: AdminViewLocationState = { sessionName: sessionName.trim() };
        navigate(`/admin/${sessionId}`, { state });
    };

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
            <AppTopBar language={language} onLanguageChange={setLanguage} />

            <div style={createSessionColumnStyle}>
                <Header title="Daily data privileges" />
                <PageCard title="Create New Session">
                    <form onSubmit={handleSubmit}>
                        <LabeledInput
                            id="session-name"
                            label="Session Name"
                            value={sessionName}
                            onChange={setSessionName}
                            placeholder="e.g.. Class Quiz Feb 21 2026"
                        />
                        <PrimaryFormButton type="submit" disabled={!sessionName.trim()}>
                            Create Session
                        </PrimaryFormButton>
                    </form>
                </PageCard>
            </div>
        </div>
    );
};

export default CreateSession;
