// Slugs for the six privilege dimensions (align with API).
export const QUESTION_CATEGORIES = [
    "age",
    "class",
    "language",
    "gender",
    "race_ethnicity",
    "ability",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export interface SessionQuestion {
    id: string;
    category: QuestionCategory;
    prompt: string;
    promptFi?: string;
}
