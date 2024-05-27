import Course from "../Models/Course.js";
import Purchase from "../Models/Orders.js";
import User from "../Models/user.js";
import Category from "../Models/Category.js";
import Contact from "../Models/Contact.js";
import AppError from "../utils/error.js";
import fs from "fs";
import pdfDocument from "pdfkit";

export const CreateCategory=async(req,res,next)=>{
    try {
        const role = req.user.role;
        const { category } = req.body;
        if (role !== "Admin") {
          throw new AppError("You are restricted from adding categories", 403);
        }
        await Category.create({
          name: category,
        });
        res.status(200).json({ success: true, data: "added" });
      } catch (error) {
        next(error);
      }
}
export const GetCategories=async(req,res,next)=>{
    try {
        const role = req.user.role;
        const categoryDoc = await Category.find();
        res.status(200).json({ success: true, data: categoryDoc });
      } catch (error) {
        next(error);
      }
}
export const DeleteCategory=async(req,res,next)=>{
    try {
        const role = req.user.role;
        const { categoryId } = req.query;
    
        if (role !== "Admin") {
          throw new AppError("You are restricted from adding categories", 403);
        }
    
        const category = await Category.findOneAndDelete({ _id: categoryId });
        if (!category) {
          throw new AppError("Category not found", 404);
        }
        res
          .status(200)
          .json({ success: true, data: `${category.name} Deleted Successfully` });
      } catch (err) {
        next(err);
      }
}
export const AddContact=async(req,res,next)=>{
    try {
        const { username, email, message } = req.body;
        if (!username || !email || !message) {
          throw new AppError("All fields are mandatory", 400);
        }
        const user = await User.find({ email });
        if (user.length === 0) {
          throw new AppError("Please login first", 403);
        }
        const contact = await Contact.create({
          name: username,
          email,
          message,
        });
        res.status(200).json({ success: true, data: contact });
      } catch (err) {
        next(err);
      }
}
export const GetContacts=async(req,res,next)=>{
    try {
        const { role } = req.user;
        if (role !== "Admin") {
          throw new AppError("You are restricted from accessing this route", 400);
        }
        const contact = await Contact.find();
        res.status(200).json({ success: true, data: contact });
      } catch (err) {
        next(err);
      }
}
export const certificate=async(req,res,next)=>{
    try {
        const user = req.user;
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const studentIndex = course.enrolled.findIndex(
          (enroll) => String(enroll.student) === user.id
        );
        if (studentIndex === -1) {
          throw new AppError("Student not found", 404);
        }
        const marks = course.total;
        const studentMarks = course.enrolled[studentIndex].totalMarks;
        const studentPerc = (studentMarks * 100) / marks;
        if (studentPerc < 75) {
          throw new AppError("You need 75% or above to get the certificate", 400);
        }
        const doc = new pdfDocument({ layout: "landscape", size: "A4" });
        const fileName = `certificate_${user.username}_${course.title}.pdf`;
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        doc.pipe(res);
    
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");
        const distanceMargin = 20;
        doc
          .fillAndStroke("#5a77d8")
          .lineWidth(20)
          .lineJoin("square")
          .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2
          )
          .stroke();
    
        const logoWidth = 100; // Adjust the width of the logo as needed
        const logoX = (doc.page.width - logoWidth) / 2;
        doc
          .image("./uploads/logo.png", logoX, 25, {
            fit: [logoWidth, 100],
            align: "center",
          })
          .moveDown(0.5)
          .fontSize(15)
          .text("SKILL BITES", { align: "center" });
    
        doc.moveDown(3);
        doc
          .font("Helvetica-Bold")
          .fontSize(40)
          .fill("#000")
          .text(`CERTIFICATE OF COMPLETION`, { align: "center" });
        doc.moveDown();
        doc
          .fontSize(14)
          .fill("#000")
          .text(`This is to certify that`, { align: "center" });
    
        doc
          .font("fonts/Satisfy-Regular.ttf")
          .fontSize(35)
          .fill("#000")
          .text(`${user.username}`, { align: "center" });
    
        doc
          .font("Times-Roman")
          .fontSize(14)
          .fill("#000")
          .text(`has successfully completed the course`, { align: "center" });
        doc.moveDown();
        doc
          .font("Times-Roman")
          .fontSize(26)
          .fill("#000")
          .text(`${course.title}`, { align: "center" });
        doc.moveDown(0.5);
        doc
          .font("Times-Roman")
          .fontSize(14)
          .fill("#000")
          .text(`with an estimated`, { align: "center" });
        doc
          .font("Times-Roman")
          .fontSize(14)
          .fill("#A4AD32")
          .text(`${studentPerc.toFixed(2) + "%"}`, {
            align: "center",
            underline: true,
          });
        doc.moveDown(2);
        doc
          .font("Times-Roman")
          .fontSize(14)
          .fill("#000")
          .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
        doc.end();
      } catch (err) {
        next(err);
      }
}
export const statistics=async(req,res,next)=>{
    try {
        const { role } = req.user;
        const courseId = req.query.courseId;
        if (role !== "Admin") {
          throw new AppError("You are restricted from accessing this route", 400);
        }
    
        const studentCount = await User.countDocuments({ role: "Student" });
        const instructorCount = await User.countDocuments({ role: "Instructor" });
        const courseCount = await Course.countDocuments({ approved: true });
        const course = await Course.findById(courseId);
        const purchases = await Purchase.find().populate("courseId", ["title"]);
        const paymentIds = purchases.map((purchase) => purchase.paymentId);
        const payments = await razorpay.payments.all({ count: 100 });
        let totalRevenue = 0;
    
        for (const payment of payments.items) {
          if (paymentIds.includes(payment.id) && payment.status === "captured")
            totalRevenue += payment.amount / 100;
        }
    
        res
          .status(200)
          .json({
            success: true,
            studentCount,
            instructorCount,
            courseCount,
            totalRevenue,
          });
      } catch (err) {
        next(err);
      }
}
export const studentPerformances=async(req,res,next)=>{
    try {
        const info = req.user;
        const { id } = req.params;
        const studentsPerformance = [];
        let noOfLectures;
        let noOfAssignments;
        let studentPerformance;
    
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        if (info.role === "Student") {
          const s_id = info?.id;
          const marks = course.total;
          const studentIndex = course.enrolled.findIndex(
            (enroll) => String(enroll.student) === s_id
          );
          if (studentIndex === -1) {
            throw new AppError("Student not found", 404);
          }
          noOfLectures = course.recordings.length;
          noOfAssignments = course.assignments.length;
          const studentMarks = course.enrolled[studentIndex].totalMarks;
          studentPerformance = parseFloat((studentMarks * 100) / marks);
        }
        if (info.role === "Instructor") {
          const purchases = await Purchase.find({ courseId: id });
          if (!purchases) {
            throw new AppError("purchase not found", 404);
          }
    
          for (const purchase of purchases) {
            const studentId = purchase.userId;
            const student = await User.findById(studentId);
            if (!student) {
              throw new AppError("Student not found", 404);
            }
            const marks = course.total;
            const enrolledStudent = course.enrolled.find(
              (enroll) => String(enroll.student) === String(studentId)
            );
            if (!enrolledStudent) {
              throw new AppError("Student not enrolled in course", 404);
            }
            const studentMarks = enrolledStudent.totalMarks;
            const percentage = parseFloat((studentMarks * 100) / marks);
            studentsPerformance.push({
              profile: student.photo,
              name: student.username,
              email: student.email,
              joined: purchase.createdAt,
              percentage,
            });
          }
        }
        res
          .status(200).json({
            success: true,
            noOfAssignments,
            noOfLectures,
            studentPerformance,
            studentsPerformance,
          });
      } catch (err) {
        next(err);
      }
}
