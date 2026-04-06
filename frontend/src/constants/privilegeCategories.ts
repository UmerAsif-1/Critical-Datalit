import type { QuestionCategory } from "../types/sessionQuestion";

// Six dimensions; shared by Join Session + Questions (API sends category slug).
export const PRIVILEGE_CATEGORIES: ReadonlyArray<{
    id: QuestionCategory;
    emoji: string;
    label: string;
}> = [
    { id: "age", emoji: "👶", label: "Age" },
    { id: "class", emoji: "💰", label: "Class" },
    { id: "language", emoji: "💬", label: "Language" },
    { id: "gender", emoji: "👫", label: "Gender" },
    { id: "race_ethnicity", emoji: "🌍", label: "Race/Ethnicity" },
    { id: "ability", emoji: "🚶", label: "Ability" },
];

const byId = Object.fromEntries(PRIVILEGE_CATEGORIES.map((c) => [c.id, c])) as Record<
    QuestionCategory,
    (typeof PRIVILEGE_CATEGORIES)[number]
>;

export function getPrivilegeCategoryDisplay(category: QuestionCategory): {
    label: string;
    emoji: string;
} {
    const row = byId[category];
    return row ? { label: row.label, emoji: row.emoji } : byId.gender;
}
