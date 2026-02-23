import { Router } from "express";
import { getQuizzes, getQuizById } from "../controllers/quiz.controller";

const router = Router();


router.get("/api/quizzes", getQuizzes);
router.get("/api/quizzes/:id", getQuizById);

export default router;