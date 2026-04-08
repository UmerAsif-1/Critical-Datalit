import type { Quiz, QuizAnswer } from "./types";

const TRAITS = [
    { id: "age",            name: "Age",           description: "Age-related online experience" },
    { id: "class",          name: "Class",         description: "Economic access online" },
    { id: "language",       name: "Language",      description: "Language comfort online" },
    { id: "gender",         name: "Gender",        description: "Gender and online voice" },
    { id: "race_ethnicity", name: "Race/Ethnicity",description: "Representation online" },
    { id: "ability",        name: "Ability",       description: "Accessibility online" },
] as const;

function likertAnswers(traitId: string): QuizAnswer[] {
    const scores = [3, 2, 1, 0];
    const labels = [
        "Completely agree",
        "Somewhat agree",
        "Somewhat disagree",
        "Completely disagree",
    ];
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
            id: "ddp-age-1",
            category: "age",
            prompt: "I am comfortable learning new apps quickly.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-1",
            category: "class",
            prompt: "I can afford a smartphone with enough storage for all the apps I need.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-1",
            category: "language",
            prompt: "Most apps and websites are available in my language.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-1",
            category: "gender",
            prompt: "My opinions online are rarely dismissed because of my gender.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-1",
            category: "race_ethnicity",
            prompt: "I see people who look like me in social media ads and influencer content.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-1",
            category: "ability",
            prompt: "I can use most apps without assistive technology.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
        {
            id: "ddp-age-2",
            category: "age",
            prompt: "I am not stereotyped as \u201ctoo young\u201d to understand technology.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-2",
            category: "class",
            prompt: "I can replace my phone or laptop if it breaks.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-2",
            category: "language",
            prompt: "I do not worry that translations will make me sound strange.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-2",
            category: "gender",
            prompt: "I do not fear gender-based threats in comment sections.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-2",
            category: "race_ethnicity",
            prompt: "I do not worry that facial recognition will misidentify me.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-2",
            category: "ability",
            prompt: "I can watch videos without needing captions.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
        {
            id: "ddp-age-3",
            category: "age",
            prompt: "I am not excluded from platforms because of age restrictions.",
            type: "single-choice",
            answers: likertAnswers("age"),
        },
        {
            id: "ddp-class-3",
            category: "class",
            prompt: "I can afford apps or tools that remove ads and tracking.",
            type: "single-choice",
            answers: likertAnswers("class"),
        },
        {
            id: "ddp-language-3",
            category: "language",
            prompt: "I can participate in online communities without language barriers.",
            type: "single-choice",
            answers: likertAnswers("language"),
        },
        {
            id: "ddp-gender-3",
            category: "gender",
            prompt: "I am not stereotyped as \u201ctoo emotional\u201d when I post online.",
            type: "single-choice",
            answers: likertAnswers("gender"),
        },
        {
            id: "ddp-race-3",
            category: "race_ethnicity",
            prompt: "I rarely experience hate speech or racism online.",
            type: "single-choice",
            answers: likertAnswers("race_ethnicity"),
        },
        {
            id: "ddp-ability-3",
            category: "ability",
            prompt: "I can easily navigate public digital services.",
            type: "single-choice",
            answers: likertAnswers("ability"),
        },
    ],
    resultLogic: {
        traits: [...TRAITS],
        determineResult: (scores: Record<string, number>): string => {
            const order = ["age", "class", "language", "gender", "race_ethnicity", "ability"];
            const scored = order.filter((id) => id in scores);
            if (scored.length === 0) return "unknown";
            return scored.reduce((min, id) =>
                (scores[id] ?? 0) < (scores[min] ?? 0) ? id : min
            );
        },
    },
};

export default dailyDataPrivileges;