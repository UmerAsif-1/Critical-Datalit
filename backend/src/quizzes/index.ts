import type { Quiz } from "./types";
import dailyDataPrivileges from "./dailyDataPrivileges";

export const quizzes: Quiz[] = [dailyDataPrivileges];

export function getQuizById(id: string): Quiz | undefined {
    return quizzes.find((q) => q.id === id);
}
