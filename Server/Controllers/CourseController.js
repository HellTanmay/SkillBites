import cloudinary from "../cloudinary.js";
import Course from "../Models/Course.js";
import Purchase from "../Models/Orders.js";
import AppError from "../utils/error.js";
import fs from 'fs'

export const createCourse=async(req,res,next)=>{
    try {
        let coverImageUrl;
        let cloudinaryRes;
        const role = req.user.role;
      if (role !== "Instructor") {
        throw new AppError("You are restricted from creating course", 403);
      }
      if (req.file) {
        cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
          folder: "course",
          width: 320,
          height: 210,
          crop: "fill",
        });
        fs.unlinkSync(req.file.path);
      } else {
        throw new AppError("thumbnail is required", 400);
      }
      coverImageUrl = cloudinaryRes.secure_url;
      const { title, summary, content, duration, price, category } = req.body;
      const categoryString = category.toString();
      const categoryIds = categoryString.split(",");
      const info = req.user;
      const courseDoc = await Course.create({
        title,
        summary,
        content,
        duration,
        price,
        cover: coverImageUrl,
        category: categoryIds,
        author: info.id,
      });
      res.json({ success: true, courseDoc });
    } catch (error) {
      next(error);
    }
}

export const fetchAllCourses=async(req,res,next)=>{
    try {
        let courses;
        const { optio } = req.query;
        const role = req.user.role;
    
        if (role === "Admin") {
          courses = await Course.find()
            .populate("author", ["username"])
            .populate("enrolled", ["id", "username"])
            .sort({ createdAt: 1 });
        } else {
          courses = await Course.find({ approved: true })
            .populate("author", ["username"])
            // .populate("category",["name"])
            .populate("enrolled", ["id", "username"])
            .sort({ createdAt: -1 });
        }
        if (optio) {
          courses = courses.filter((course) => course.category.includes(optio));
        }
        res.status(200).json({ success: true, data: courses });
      } catch (error) {
        next(error);
      }
}

export const fetchCourseById=async(req,res,next)=>{
    const { id } = req.params;
  const courseDoc = await Course.findById(id).populate("author", ["username"]);
  res.json(courseDoc);
}

export const fetchMyCourse=async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let courses;
        if (role === "Instructor") {
          courses = await Course.find({ author: userId }).populate("author", [
            "username",
          ]);
          if (!courses) {
            throw new AppError("Course not found", 400);
          }
        } else if (role === "Student") {
          const purchase = await Purchase.find({ userId });
          if (!purchase) {
            throw new AppError("You have not purchased any course", 400);
          }
          const courseId = purchase.map((purchase) => purchase.courseId);
          courses = await Course.find({ _id: { $in: courseId } }).populate(
            "author",
            ["username"]
          );
          const paymentIdMap = purchase.reduce((acc, purchase) => {
            acc[purchase.courseId.toString()] = purchase.paymentId;
            return acc;
          }, {});
          courses = courses.map((course) => {
            const paymentId = paymentIdMap[course._id.toString()];
            return { ...course.toObject(), paymentId };
          });
        }
        res.json({ success: true, data: courses });
      } catch (err) {
        next(err);
      }
}

export const approveCourse=async(req,res,next)=>{
    try {
        const { role } = req.user;
        const { c_id, status } = req.body;
    
        if (role !== "Admin") {
          throw new AppError("You dont have permission", 403);
        }
        const course = await Course.findById(c_id);
        if (!course) {
          throw new AppError("Course not found", 400);
        }
        if (course.approved === true) {
          throw new AppError("Already approved", 400);
        }
        if (status) {
          course.approved = true;
          course.save();
          return res.status(200).json({ success: true, data: course });
        } else {
          throw new AppError("Something went wrong", 400);
        }
      } catch (err) {
        return next(err);
      }
}

export const deleteCourse=async(req,res,next)=>{
    try {
        const role = req.user.role;
        const id = req.user.id;
        const courseId = req.query.courseId;
        const author = await Course.find({ author: id });
        if (role == "Student" || !author) {
            throw new AppError("You dont have permission to enter this route", 403);
        }
    
        const course = await Course.findOneAndDelete({ _id: courseId });
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        res.status(200).json({
                success: true, 
                message: `${course.title} Deleted Successfully` 
            });
    } catch (err) {
        next(err);
}
}

