export interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
    resultLogic: PersonalityResultLogic; // The name of this needs to be changed after we define the quizzes
}

export interface QuizQuestion {
    id: string;
    prompt: string;
    type: "single-choice";
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    id: string;
    label: string;
    traitEffects: TraitEffect[]; // This name also needs to be changed
}

export interface TraitEffect { // TODO: Change name
    traitId: string;                // Which trait is affected
    value: number;                  // How much it changes the score
}

export interface PersonalityResultLogic { // TODO: Change name
    traits: PersonalityTrait[];     // All traits used in this quiz, name also need to be changed
    determineResult: (scores: Record<string, number>) => string; // The function to determine the outcome
}

export interface PersonalityTrait {// TODO: Change name
    id: string;
    name: string;
    description: string;
}

