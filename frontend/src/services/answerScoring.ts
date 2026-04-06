import type { QuestionCategory } from "../types/sessionQuestion";
import type { SessionQuestion } from "../types/sessionQuestion";

// Likert → 0–10 score for radar.
export function answerValueToScore(value: string): number {
    switch (value) {
        case "completely_agree":
            return 10;
        case "somewhat_agree":
            return 7.5;
        case "somewhat_disagree":
            return 4;
        case "completely_disagree":
            return 1.5;
        default:
            return 5;
    }
}

// Per-category scores; averages duplicate categories.
export function scoresFromSubmittedAnswers(
    questions: SessionQuestion[],
    answersByIndex: Record<number, string>,
): Partial<Record<QuestionCategory, number>> {
    const sums: Partial<Record<QuestionCategory, { total: number; count: number }>> = {};

    questions.forEach((q, i) => {
        const raw = answersByIndex[i];
        if (raw === undefined) {
            return;
        }
        const s = answerValueToScore(raw);
        const prev = sums[q.category] ?? { total: 0, count: 0 };
        sums[q.category] = { total: prev.total + s, count: prev.count + 1 };
    });

    const out: Partial<Record<QuestionCategory, number>> = {};
    (Object.keys(sums) as QuestionCategory[]).forEach((cat) => {
        const agg = sums[cat]!;
        out[cat] = Math.round((agg.total / agg.count) * 10) / 10;
    });
    return out;
}
