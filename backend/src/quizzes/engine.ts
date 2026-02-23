import type {Quiz, QuizQuestion} from "./types";


export function computeTraitTotals(quiz: Quiz, answers: (number | null)[]) {
    const totals:  Record<string,number> = {};

    for (const trait of quiz.resultLogic.traits){
        totals[trait.id] = 0;
    }

    quiz.questions.forEach((question:QuizQuestion, index:number) => {
        const answerIndex = answers[index];
        if (answerIndex == null){
            return;
        }

        const answer = question.answers[answerIndex];
        for (const effect of answer.traitEffects){
            totals[effect.traitId] = (totals[effect.traitId] ?? 0) + effect.value;
        }


    });
    return totals;
}

export function computeResult(quiz: Quiz, totals: Record<string,number>){
    return quiz.resultLogic.determineResult(totals);
}