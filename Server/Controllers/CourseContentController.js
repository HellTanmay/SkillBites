import cloudinary from "../cloudinary.js";
import Course from "../Models/Course.js";
import AppError from "../utils/error.js";
import fs from "fs";

export const createLecture = async (req, res, next) => {
  try {
    let course;
    let videoUrl = {};
    const { id } = req.params;
    const info = req.user;
    course = await Course.findById(id);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
    if (info.role !== "Instructor") {
      throw new AppError("You dont have permission to add lectures", 400);
    }
    if (req.file) {
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "video",
        resource_type: "video",
      });
      fs.unlinkSync(req.file.path);

      videoUrl.secure_url = cloudinaryRes.secure_url;
      videoUrl.public_id = cloudinaryRes.public_id;
    } else {
      throw new AppError("File not found", 404);
    }
    const { title, description } = req.body;
    course.recordings.push({
      file: videoUrl,
      filename: title,
      description,
    });
    course.total += 1;
    await course.save();
    res.status(200).json({ success: true, message: "lecture added", course });
  } catch (err) {
    next(err);
  }
};

export const fetchLectures = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        course.recordings.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        res.status(200).json({ status: true, data: course.recordings });
      } catch (err) {
        next(err);
      }
};

export const updateLecture = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const lectureId = req.query.lecture_id;
    
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const lectureIndex = course.recordings.findIndex(
          (lecture) => lecture._id.toString() === lectureId.toString()
        );
        if (lectureIndex === -1) {
          throw new AppError("Lecture does not exist.", 404);
        }
        const studentIndex = course.enrolled.findIndex(
          (enroll) => String(enroll.student) === userId
        );
        if (studentIndex === -1) {
          throw new AppError("student does not exist.", 404);
        }
        const alreadyWatched =
          course.recordings[lectureIndex].watched.indexOf(userId);
        if (alreadyWatched == -1) {
          course.recordings[lectureIndex].watched.push(userId);
          course.enrolled[studentIndex].totalMarks += 1;
        } else {
          throw new AppError("Already marked", 404);
        }
        await course.save();
        res.status(200).json({ success: true, data: course.recordings });
      } catch (err) {
        next(err);
      }
};

export const deleteLecture = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const lectureId = req.query.lecture_id;
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
        const lectureIndex = course.recordings.findIndex(
          (lecture) => lecture._id.toString() === lectureId.toString()
        );
        if (lectureIndex === -1) {
          throw new AppError("Lecture does not exist.", 404);
        }
        await cloudinary.uploader.destroy(
          course.recordings[lectureIndex].file.public_id,
          {
            resource_type: "video",
          }
        );
        course.total -= 1;
        course.recordings.splice(lectureIndex, 1);
        await course.save();
        res.status(200).json({ success: true, data: `Lecture deleted` });
      } catch (err) {
        next(err);
      }
};

export const createAssignments = async (req, res, next) => {
    try {
        let course;
        let newPath;
        const { id } = req.params;
        const info = req.user;

      course = await Course.findById(id);
      if (!course) {
        throw new AppError("Course not found", 404);
      }
      if (info.role !== "Instructor") {
        throw new AppError("You are restricted from adding assignments", 400);
      }
   if(req.file){
    newPath=req.file.path
   }
      const { title, description, marks } = req.body;
      const parseMarks = parseInt(marks);
      course.assignments.push({
        title,
        description,
        marks: parseMarks,
        file: newPath,
      });
      course.total += parseMarks;
      await course.save();
      return res.status(200).json({ success: true, data: course });
    } catch (err) {
      next(err);
    }
};

export const fetchAssignments = async (req, res, next) => {
    try {
        const user = req.user.id;
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        course.assignments.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        return res.status(200).json({ status: true, data: course.assignments });
      } catch (err) {
        next(err);
      }
};

export const deleteAssignments = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const assignId = req.query.assignment_id;
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
        const assignIndex = course.assignments.findIndex(
          (assign) => assign._id.toString() === assignId.toString()
        );
        if (assignIndex === -1) {
          throw new AppError("Course does not exist.", 404);
        }
        const assignmentMarks = course.assignments[assignIndex].marks;
        course.total -= assignmentMarks;
        course.assignments.splice(assignIndex, 1);
        await course.save();
        res.status(200).json({ success: true, data: "Deleted successfully" });
      } catch (err) {
        next(err);
      }
};

export const submitAssignments = async (req, res, next) => {
    try {
        const info = req.user;
        const { id } = req.params;
        const { assignment_id } = req.query;
        let newPath;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const assignment = await course.assignments.id(assignment_id);
        if (!assignment) {
          throw new AppError("Assignment not found", 404);
        }
        if (info.role !== "Student") {
          throw new AppError("Only Student can send assignment", 400);
        }
        if (req.file) {
          newPath=req.file.path
        }
        const { description } = req.body;
        assignment.submit.push({
          student: info.id,
          description,
          file: newPath,
        });
        await course.save();
        return res.status(200).json({
             success: true, 
             data: "Submitted successfully" });
      } catch (err) {
        next(err);
      }
};

export const fetchSubmissions = async (req, res, next) => {
    try {
        const info = req.user.role;
        const { id } = req.params;
        const { assignment_id } = req.query;
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const assignment = await course.assignments.id(assignment_id);
    
        if (!assignment) {
          throw new AppError("Assignment not found", 404);
        }
        const submit = assignment.submit;
        const studentIds = submit.map((subdoc) => subdoc.student);
        const students = await User.find({ _id: { $in: studentIds } }, "username");
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
};

export const updateSubmissions = async (req, res, next) => {
    try {
        const info = req.user.role;
        const { id } = req.params;
        const { assignment_id } = req.query;
        const { status, sub_id } = req.body;
    
        const course = await Course.findById(id);
        if (!course) {
          throw new AppError("Course not found", 404);
        }
        const assignment = await course.assignments.id(assignment_id);
        if (!assignment) {
          throw new AppError("Assignment not found", 404);
        }
        if (info !== "Instructor") {
          throw new AppError("You dont have permission to access this route", 403);
        }
    
        const submissionIndex = assignment.submit.findIndex(
          (submission) => submission._id.toString() === sub_id
        );
    
        if (submissionIndex === -1) {
          throw new AppError("Submission not found", 404);
        }
        const studentId = String(assignment.submit[submissionIndex].student);
        const studentIndex = course.enrolled.findIndex(
          (enroll) => String(enroll.student) === studentId
        );
        if (studentIndex === -1) {
          throw new AppError("Student not found", 404);
        }
        if (status) {
          assignment.submit[submissionIndex].status = "submitted";
          assignment.submit[submissionIndex].marks = assignment.marks;
          course.enrolled[studentIndex].totalMarks += assignment.marks;
          await course.save();
          const updatedSubmission = assignment.submit.id(sub_id);
          res.status(200).json({ success: true, data: updatedSubmission });
        } else {
          res.status(400).json({
              success: false,
              data: assignment.submit,
              message: "You cant change the form once the it is corrected",
            });
        }
      } catch (err) {
        next(err);
      }
};
