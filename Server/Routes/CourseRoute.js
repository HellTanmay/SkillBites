import { Router } from "express";
import {approveCourse, createCourse, deleteCourse, fetchAllCourses, fetchCourseById, fetchMyCourse} from '../Controllers/CourseController.js'
import { verifyToken } from "../Middleware/authMid.js";
import { uploadImageVideo } from "../Middleware/multer.js";

const router=Router()
router.post('/createCourse',verifyToken,uploadImageVideo.single("file"), createCourse)

router.get('/fetchCourses',verifyToken,fetchAllCourses)
        .get('/course/:id',fetchCourseById)
        .get('/myCourse',verifyToken,fetchMyCourse)

router.put('/admin/course',verifyToken,approveCourse)

router.delete('/deleteCourse',verifyToken,deleteCourse)
export default router