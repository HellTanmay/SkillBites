import cloudinary from "../cloudinary.js";
import Course from "../Models/Course.js";
import Purchase from "../Models/Orders.js";
import User from "../Models/user.js";
import AppError from "../utils/error.js";
import fs from "fs";
import xlsx from 'xlsx';

export const createQuiz=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const userInfo = req.user;
        let newPath;
        if (userInfo.role !== "Instructor") {
          throw new AppError("You are restricted to create quizzes", 403);
        }
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const { title, marks, duration } = req.body;
        if (req.file) {
        newPath=req.file.path
        }
        const workbook = xlsx.readFile(newPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        let totalMarks = 0;
  
        totalMarks = marks * data.length;
        course.quizz.push({
          title,
          file: newPath,
          mark: marks,
          duration,
          totalmarks: totalMarks,
        });
        course.total += totalMarks;
        await course.save();
        res.status(200).json({ 
            success: true, 
            data: course.quizz, 
            message: "Test added" 
        });
    } catch (err) {
    next(err);
    }
}

export const DisplayQuiz=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const userInfo = req.user;
    
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        let quizzes;
        quizzes = course.quizz;
        res.status(200).json({
            success: true,
            data: quizzes 
        });
    } catch (error) {
        next(error);
    }
}

export const fetchQuestions=async(req,res,next)=>{
    try {
        const userInfo = req.user;
        const { id } = req.params;
        const { quizz_id } = req.query;
        let data=[]
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
       
        if (quizz_id) {
          const quizz = course.quizz.id(quizz_id);
          const file = quizz.file;
          const workbook = xlsx.readFile(file);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = xlsx.utils.sheet_to_json(worksheet);
        }
        let quizzData = data;
        if (userInfo.role === "Student") {
          quizzData = data.map((items) => {
            delete items.Correct;
            return items;
          });
        }
        res.status(200).json({ success: true, data: quizzData });
      } catch (error) {
        next(error);
      }
}

export const DeleteQuiz=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const { quizz_id } = req.query;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        if (role !== "Instructor") {
          throw new AppError("You are forbidden", 403);
        }
        if (course.author.toString() !== userId.toString()) {
          throw new AppError("You cannot make changes to this course", 403);
        }
        const quizzIndex = course.quizz.findIndex(
          (quizz) => quizz._id.toString() === quizz_id.toString()
        );
        if (quizzIndex === -1) {
          throw new AppError("Test does not exist.", 404);
        }
        
        const quizzMarks = course.quizz[quizzIndex].totalmarks;
        course.total -= quizzMarks;

        course.quizz[quizzIndex].submitQuiz.forEach(submission => {
          const studentIndex = course.enrolled.findIndex(
            enrolled => enrolled.student.toString() === submission.student.toString()
          );
          if (studentIndex !== -1) {
            course.enrolled[studentIndex].totalMarks -= submission.marks;
          }
        });
        if (course.quizz[quizzIndex].file) {
          fs.unlinkSync(course.quizz[quizzIndex].file);
        }
        course.quizz.splice(quizzIndex, 1);
        await course.save();
    
        res.status(200).json({ 
            success: true, 
            data: "Deleted successfully" 
        });
    } catch (error) {
        next(error);
        }
}

export const SubmitQuiz=async(req,res,next)=>{
    try {
        const info = req.user;
        const { id } = req.params;
        const { quizz_id } = req.query;
        const course = await Course.findById(id);
        let data=[]
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const quizz = await course.quizz.id(quizz_id);
        if (!quizz) {
          throw new AppError("Quizz not found", 404);
        }
        if (info.role !== "Student") {
          throw new AppError("Only Student can submit Tests", 400);
        }
        const answers = req.body;
      
        const file = quizz.file;
        const workbook = xlsx.readFile(file);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = xlsx.utils.sheet_to_json(worksheet);
        let score = 0;
        data.forEach((row, index) => {
          // Extract correct answer for the current question
          const correctAnswer = row["Correct"];
          // Check if the submitted answer matches the correct answer
          const submittedAnswer = answers[index + 1];
          if (
            submittedAnswer &&
            submittedAnswer.toLowerCase() === correctAnswer.toLowerCase()
          ) {
            score++;
          }
        });
        const studentIndex = course.enrolled.findIndex(
          (enroll) => String(enroll.student) === String(info.id)
        );
        if (studentIndex === -1) {
          throw new AppError("Student not found", 404);
        }
        const submit = quizz.submitQuiz;
        const marks = quizz.mark * score;
        course.enrolled[studentIndex].totalMarks += marks;
        submit.push({
          student: info.id,
          marks,
        });
        await course.save();
        res.status(200).json({ success: true, data: submit });
      } catch (error) {
        next(error);
      }
}
export const GetSubmissions=async(req,res,next)=>{
    try {
        const info = req.user;
        const { id } = req.params;
        const { quizz_id } = req.query;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const quizz = await course.quizz.id(quizz_id);
        if (!quizz) {
          throw new AppError("Quizz not found", 404);
        }
    
        const studentIndex = quizz.submitQuiz.findIndex(
          (quiz) => String(quiz.student) === String(info.id)
        );
        if (studentIndex === -1) {
          throw new AppError("Student not found", 404);
        }
        const result = quizz.submitQuiz[studentIndex];
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        next(error);
      }
}

export const GetAllSubmissions=async(req,res,next)=>{
    try {
        const info = req.user.role;
        const { id } = req.params;
        const { quizz_id } = req.query;
    
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const quizz = await course.quizz.id(quizz_id);
    
        if (!quizz) {
          throw new AppError("Test not found", 404);
        }
        const submit = quizz.submitQuiz;
        const studentIds = submit.map((subdoc) => subdoc.student);
        const students = await User.find(
          { _id: { $in: studentIds } },
          "username email photo "
        );
        submit.forEach((subdoc) => {
          const student = students.find(
            (student) => student._id.toString() === subdoc.student.toString()
          );
          subdoc.student = student;
        });
        submit.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        res.status(200).json({ success: true, data: submit });
      } catch (err) {
        next(err);
      }
}