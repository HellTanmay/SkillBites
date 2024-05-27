import { Router } from "express";
import {DeleteQuiz, DisplayQuiz, GetAllSubmissions, GetSubmissions, SubmitQuiz, createQuiz, fetchQuestions} from '../Controllers/QuizController.js'
import { verifyToken } from "../Middleware/authMid.js";
import { uploadImageVideo,uploadDocument } from "../Middleware/multer.js";

const router=Router()

router.post('/AddQuizz/:id',verifyToken, uploadDocument.single("excel"),createQuiz)
        .post('/AnswerSubmit/:id',verifyToken,SubmitQuiz)

router.get('/DisplayQuizz/:id',verifyToken,DisplayQuiz)
        .get('/getQuiz/:id',verifyToken,fetchQuestions)
        .get('/getQuizSubmission/:id',verifyToken,GetSubmissions)
        .get('/getAllSubmissions/:id',verifyToken,GetAllSubmissions)
        
router.delete('/deleteQuiz/:id',verifyToken,DeleteQuiz)

export default router