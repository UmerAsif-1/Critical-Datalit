export interface Quiz {
    id: string;
    title: string;
    titleFi?: string;
    questions: QuizQuestion[];
    resultLogic: PersonalityResultLogic;
}

export interface QuizQuestion {
    id: string;
    prompt: string;
    promptFi?: string;
    type: "single-choice";
    category?: string;
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    id: string;
    label: string;
    labelFi?: string;
    traitEffects: TraitEffect[];
}

export interface TraitEffect {
    traitId: string;
    value: number;
}

export interface PersonalityResultLogic {
    traits: PersonalityTrait[];
    determineResult: (scores: Record<string, number>) => string;
}

export interface PersonalityTrait {
    id: string;
    name: string;
    description: string;
}
