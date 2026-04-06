import { Request, Response } from "express";
import { getQuizById } from "../quizzes";
import { computeTraitTotals, computeResult } from "../quizzes/engine";

export function getPlayerResult(req: Request, res: Response) {
    const { session, game } = req.user!;

    const quiz = getQuizById(session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz unavailable" });
    }

    const totalQuestions = quiz.questions.length;
    const answers: (number | null)[] = [];
    for (let i = 1; i <= totalQuestions; i++) {
        const key = `answer_${i}` as const;
        const raw = (game as any)[key];

        if (raw === null || raw === undefined) {
            answers.push(null);
        } else {
            const numeric = typeof raw === "number" ? raw : Number(raw);
            answers.push(Number.isNaN(numeric) ? null : numeric);
        }
    }

    const answeredCount = answers.filter((a) => a !== null).length;
    if (answeredCount < totalQuestions) {
        return res.json({
            pending: true,
            answered: answeredCount,
            total: totalQuestions,
        });
    }


    for (let i = 0; i < totalQuestions; i++) {
        const answerIndex = answers[i];
        if (answerIndex == null){
            continue;
        }
        const question = quiz.questions[i];
        if (answerIndex < 0 || answerIndex >= question.answers.length) {
            return res
                .status(410)
                .json({ error: "Stored answer index invalid for this quiz version" });
        }
    }

    const totals = computeTraitTotals(quiz, answers);
    const finalResult = computeResult(quiz, totals);

    const traits = quiz.resultLogic.traits.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        score: totals[t.id],
    }));

    return res.json({
        pending: false,
        result: finalResult,
        traits,
    });
}