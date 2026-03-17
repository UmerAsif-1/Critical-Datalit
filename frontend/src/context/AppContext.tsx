// src/context/AppContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// ----------------- Types -----------------
export type Language = "EN" | "FI";

export type Role = "player" | "admin" | null;

export interface AppState {
    language: Language;
    setLanguage: (lang: Language) => void;

    sessionId: string | null;
    setSessionId: (id: string) => void;

    role: Role;
    setRole: (role: Role) => void;

    currentQuestion: number;
    setCurrentQuestion: (index: number) => void;

    answers: Record<number, string>; // questionIndex -> "yes"/"no"
    setAnswer: (questionIndex: number, answer: string) => void;
}

// ----------------- Default State -----------------
const defaultState: AppState = {
    language: "EN",
    setLanguage: () => { },

    sessionId: null,
    setSessionId: () => { },

    role: null,
    setRole: () => { },

    currentQuestion: 0,
    setCurrentQuestion: () => { },

    answers: {},
    setAnswer: () => { },
};

// ----------------- Context -----------------
export const AppContext = createContext<AppState>(defaultState);

// ----------------- Provider -----------------
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("EN");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const setAnswer = (questionIndex: number, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                sessionId,
                setSessionId,
                role,
                setRole,
                currentQuestion,
                setCurrentQuestion,
                answers,
                setAnswer,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Add this empty export to satisfy TypeScript isolatedModules
export { };