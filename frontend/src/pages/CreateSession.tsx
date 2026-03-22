import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import AppTopBar from "../components/AppTopBar/AppTopBar";
import Header from "../components/Header/Header";
import PageCard from "../components/PageCard/PageCard";
import LabeledInput from "../components/LabeledInput/LabeledInput";
import LabeledSelect from "../components/LabeledSelect/LabeledSelect";
import PrimaryFormButton from "../components/PrimaryFormButton/PrimaryFormButton";
import { colors } from "../theme/colors";

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

const AGE_GROUP_OPTIONS = [
    { value: "11-14", label: "11–14" },
    { value: "15-18", label: "15–18" },
    { value: "18+", label: "18+" },
];

const CreateSession: React.FC = () => {
    const { language, setLanguage } = useContext(AppContext);
    const [sessionName, setSessionName] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionName.trim() || !ageGroup) {
            return;
        }
        console.log("Create session", { sessionName: sessionName.trim(), ageGroup });
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
                <Header title="Critical DataLit" />
                <PageCard title="Create New Session">
                    <form onSubmit={handleSubmit}>
                        <LabeledInput
                            id="session-name"
                            label="Session Name"
                            value={sessionName}
                            onChange={setSessionName}
                            placeholder="e.g.. Class Quiz Feb 21 2026"
                        />
                        <LabeledSelect
                            id="participants-age"
                            label="Participants Age"
                            value={ageGroup}
                            onChange={setAgeGroup}
                            options={AGE_GROUP_OPTIONS}
                            placeholderLabel="Select Age Group"
                        />
                        <PrimaryFormButton type="submit" disabled={!sessionName.trim() || !ageGroup}>
                            Create Session
                        </PrimaryFormButton>
                    </form>
                </PageCard>
            </div>
        </div>
    );
};

export default CreateSession;
