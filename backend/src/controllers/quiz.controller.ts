import { Request, Response } from "express";
import { quizzes, getQuizById as findQuizById } from "../quizzes";
import type { Quiz } from "../quizzes/types";


interface PublicQuizSummary {
    id: string;
    title: string;
    questionCount: number;
}

interface PublicQuizAnswer {
    id: string;
    label: string;
    labelFi?: string;
}

interface PublicQuizQuestion {
    id: string;
    prompt: string;
    promptFi?: string;
    type: "single-choice";
    category?: string;
    answers: PublicQuizAnswer[];
}

interface PublicQuizDetail {
    id: string;
    title: string;
    titleFi?: string;
    questions: PublicQuizQuestion[];
}

function toPublicDetail(q: Quiz): PublicQuizDetail {
    return {
        id: q.id,
        title: q.title,
        ...(q.titleFi ? { titleFi: q.titleFi } : {}),
        questions: q.questions.map((qq) => ({
            id: qq.id,
            prompt: qq.prompt,
            ...(qq.promptFi ? { promptFi: qq.promptFi } : {}),
            type: qq.type,
            ...(qq.category ? { category: qq.category } : {}),
            answers: qq.answers.map((a) => ({
                id: a.id,
                label: a.label,
                ...(a.labelFi ? { labelFi: a.labelFi } : {}),
            })),
        })),
    };
}

export function getQuizzes(_req: Request, res: Response) {
    const data: PublicQuizSummary[] = quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        questionCount: q.questions.length,
    }));
    res.json(data);
}


export function getQuizById(req: Request, res: Response) {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const quiz = findQuizById(id);
    if (!quiz){
        return res.status(404).json({ error: "Quiz not found" });
    }

    const publicQuiz = toPublicDetail(quiz);
    return res.json(publicQuiz);
}
