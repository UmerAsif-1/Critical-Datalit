import type { Quiz, QuizAnswer } from "./types";

const TRAITS = [
    { id: "age", name: "Age", description: "Age-related online experience" },
    { id: "class", name: "Class", description: "Economic access online" },
    { id: "language", name: "Language", description: "Language comfort online" },
    { id: "gender", name: "Gender", description: "Gender and online voice" },
    { id: "race_ethnicity", name: "Race/Ethnicity", description: "Representation online" },
    { id: "ability", name: "Ability", description: "Accessibility online" },
] as const;

function likertAnswers(traitId: string): QuizAnswer[] {
    const scores = [10, 8, 4, 2];
    const labels = ["Completely agree", "Somewhat agree", "Somewhat disagree", "Completely disagree"];
    return labels.map((label, i) => ({
        id: `${traitId}-opt-${i}`,
        label,
        traitEffects: [{ traitId, value: scores[i]! }],
    }));
}

const dailyDataPrivileges: Quiz = {
    id: "daily-data-privileges",
    title: "Daily data privileges",
    questions: [
        {
            id: "ddp-age",
            category: "age",
            prompt: "People rarely make assumptions about me online because of my age.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class",
            category: "class",
            prompt: "I can afford devices and data plans that keep me well connected online.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language",
            category: "language",
            prompt: "I can use the web comfortably in my preferred language.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender",
            category: "gender",
            prompt: "My opinions online are rarely dismissed because of my gender.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race",
            category: "race_ethnicity",
            prompt: "I rarely see harmful stereotypes about my racial or ethnic background online.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability",
            category: "ability",
            prompt: "Most websites and apps I need are usable with my abilities and assistive tools.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
    ],
    resultLogic: {
        traits: [...TRAITS],
        determineResult: (scores: Record<string, number>): string => {
            const entries = Object.entries(scores).filter(([, v]) => v > 0);
            if (entries.length === 0) return "unknown";
            const [top] = entries.sort((a, b) => b[1] - a[1]);
            return top![0];
        },
    },
};

export default dailyDataPrivileges;
