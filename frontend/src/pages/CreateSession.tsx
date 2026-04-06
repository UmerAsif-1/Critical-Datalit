import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AppTopBar from "../components/AppTopBar/AppTopBar";
import Header from "../components/Header/Header";
import PageCard from "../components/PageCard/PageCard";
import LabeledInput from "../components/LabeledInput/LabeledInput";
import PrimaryFormButton from "../components/PrimaryFormButton/PrimaryFormButton";
import { colors } from "../theme/colors";
import { DEFAULT_QUIZ_ID } from "../constants/quiz";
import { createSessionRequest } from "../services/api";
import type { AdminViewLocationState } from "./AdminView";

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
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionName.trim()) {
            return;
        }
        setSubmitError(null);
        setIsSubmitting(true);
        void (async () => {
            try {
                const created = await createSessionRequest(DEFAULT_QUIZ_ID);
                const state: AdminViewLocationState = {
                    sessionName: sessionName.trim(),
                    joinCode: created.joinCode,
                };
                navigate(`/admin/${created.sessionId}`, { state });
            } catch (err) {
                setSubmitError(err instanceof Error ? err.message : "Could not create session");
            } finally {
                setIsSubmitting(false);
            }
        })();
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
                        {submitError && (
                            <p style={{ color: "#b00020", fontSize: 14, marginBottom: 12 }}>{submitError}</p>
                        )}
                        <PrimaryFormButton type="submit" disabled={!sessionName.trim() || isSubmitting}>
                            {isSubmitting ? "Creating…" : "Create Session"}
                        </PrimaryFormButton>
                    </form>
                </PageCard>
            </div>
        </div>
    );
};

export default CreateSession;
