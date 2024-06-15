import { Router } from "express";
import { createAssignments, createLecture, deleteAssignments, deleteLecture, fetchAssignments, fetchLectures, fetchSubmissions, getCourseContent, submitAssignments, updateLecture, updateSubmissions } from '../Controllers/CourseContentController.js'
import { verifyToken } from "../Middleware/authMid.js";
import { uploadImageVideo,uploadDocument } from "../Middleware/multer.js";

const router=Router()

router.post('/addLecture/:id',verifyToken,uploadImageVideo.single('video'),createLecture)
        .post('/addAssignments/:id',verifyToken,uploadDocument.single('pdf'),createAssignments)
        .post('/submitAssign/:id',verifyToken,uploadDocument.single('submit'),submitAssignments)

router.get('/getLectures/:id',verifyToken,fetchLectures)
        .get('/getAssignments/:id',verifyToken,fetchAssignments)
        .get('/assignments/:id',verifyToken,fetchSubmissions)
        .get('/courseContents/:id',verifyToken,getCourseContent)

router.patch('/updateLecture/:id',verifyToken,updateLecture)

router.put('/UpdateSubmission/:id',verifyToken,updateSubmissions)

router.delete('/deleteLecture/:id',verifyToken,deleteLecture)
        .delete('/deleteAssignment/:id',verifyToken,deleteAssignments)
export default router