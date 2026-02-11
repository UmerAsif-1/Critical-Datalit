import type { Quiz } from "./types";
import example from "./examplequiz"; // TODO: Rename after implementing the quiz

export const quizzes: Quiz[] = [
    example
];

export function getQuizById(id: string): Quiz | undefined {
    return quizzes.find(q => q.id === id);
}
