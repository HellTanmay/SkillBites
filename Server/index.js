const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const pdfDocument=require('pdfkit');

const mongoose = require("mongoose");
const User = require("./Models/user.js");
const Course = require("./Models/Course.js");
const Purchase = require("./Models/Orders.js");
const Contact=require("./Models/Contact.js");

const app = express();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadFile = multer({ dest: "pdf/" });

const upload = require("./Middleware/multer.js");
const fs = require("fs");
const cloudinary = require("./cloudinary.js");

const { Token, verifyToken } = require("./Middleware/authMid.js");
const path = require("path");
const { config } = require("dotenv");
config({ path: "./.env" });

const razorpay = require("./Razorypay.js");
const AppError = require("./Middleware/error.js");
const ErrorHandler = require("./Middleware/errorHandler.js");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/pdf", express.static(__dirname + "/pdf"));

 mongoose.connect(
  "mongodb://tanmay:azzKA5F0PM0S5rYv@ac-bsnirje-shard-00-00.9ugir26.mongodb.net:27017,ac-bsnirje-shard-00-01.9ugir26.mongodb.net:27017,ac-bsnirje-shard-00-02.9ugir26.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gtfzc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
  console.log("Connection successful");
})
.catch((error) => {
console.log(error)
});

app.post("/Signup", async (req, res, next) => {
  const { username, email, password, role } = req.body;
  try {
    const userDoc = await User.create({
      username,
      email,
      password,
      role,
    });
    const token = Token(userDoc);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
    });
    res.status(200).json({ success:true, message: "Signup successful", userDoc, token });
  } catch (err) {
    next(err)
  }
});

app.post("/Login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      throw new AppError('User not found',404)
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const token = Token(userDoc);
      res.cookie("token", token, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      res.json({token,role:userDoc.role});
    } else {
      throw new AppError('Wrong password',400)
    }
  } catch (err) {
    next(err)
  }
});

app.get("/verify", verifyToken, (req, res) => {
  const info = req.user;
  res.json(info);
});

app.get("/profile", verifyToken, async (req, res, next) => {
  try {
    let userId = req.user.id;
    const userDoc = await User.findById(userId).select("-password");
    if (!userDoc) {
      throw new AppError('User not found',404)
    } else {
      res.json(userDoc);
    }
  } catch (error) {
   next(error)
  }
});

app.get("/fetchAllUsers",async(req,res, next)=>{
  try {
  const users=await User.find({role:'Student'}).select('-password')
  const purchases = await Promise.all(users.map(async user => {
    const purchases = await Purchase.find({ userId: user._id }).populate("courseId", ["title"]);
    return {
      user: user.toObject(),
      purchases: purchases.map(purchase => purchase.toObject())
    };
  }));
  const instructors=await User.find({role:'Instructor'}).select('-password')
  const courses = await Promise.all(instructors.map(async user => {
    const courses = await Course.find({ author: user._id })
    return {
      instructor: user.toObject(),
      courses: courses.map(course => course.toObject())
    };
  }));
    res.status(200).json({ success: true, data:purchases,data2:courses });
  } catch (error) {
   next(err)
  }
});


app.put("/profile/edit",verifyToken,upload.single("avatar"),
  async (req, res, next) => {
    let imageUrl;
    try {
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        const cloudRes = await cloudinary.uploader.upload(newPath, {
          folder: "avatar",
          gravity:'face',
        });
        fs.unlinkSync(newPath);
        imageUrl = cloudRes.secure_url;
      }
      const {phone}=req.body
      if(!(/^\d{10}$/).test(phone)){
        throw new AppError('Please provide a valid mobile number',400)
      }

      const updateData = {
        ...(imageUrl && { photo: imageUrl }),
        ...req.body,
      };
      const info = req.user;
      const userDoc = await User.findByIdAndUpdate(info.id, updateData, {
        new: true,runValidators:true,
      });
      res.status(200).json({success:true,userDoc});
    } catch (err) {
      next(err)
    }
  }
);

app.post("/course", verifyToken, upload.single("file"), async (req, res, next) => {
  let coverImageUrl;
  let cloudinaryRes;
  const role=req.user.role
  try {
    if(role!=='Instructor'){
      throw new AppError('You are restricted from creating course',400)
    }
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);

      cloudinaryRes = await cloudinary.uploader.upload(newPath, {
        folder: "course",
        width: 320,
        height: 210,
        crop: "fill",
      });
      fs.unlinkSync(newPath);
    }
    else{
      throw new AppError('thumbnail is required',400)
    }
    coverImageUrl = cloudinaryRes.secure_url;
    const { title, summary, content, duration, price } = req.body;
    const info = req.user;
    const courseDoc = await Course.create({
      title,
      summary,
      content,
      duration,
      price,
      cover: coverImageUrl,
      author: info.id,
    });
    res.json({success:true, courseDoc });
  } catch (error) {
    next(error)
  }
});

app.get("/course", verifyToken, async (req, res, next) => {
  try {
    let courses;
    const role=req.user.role
    if (role === "Admin") {
      courses = await Course.find()
        .populate("author", ["username"])
        .populate("enrolled", ["id", "username"])
        .sort({ createdAt: 1 });
    } else {
      courses = await Course.find({ approved: true })
        .populate("author", ["username"])
        .populate("enrolled", ["id", "username"])
        .sort({ createdAt: 1 });
    }
    res.status(200).json({success:true,data:courses})
   
  } catch (error) {
   next(error)
  }
});

app.put("/admin/course",verifyToken,async(req,res,next)=>{
  try{
  const {role}=req.user
  const {c_id,status}=req.body;
  console.log(c_id)
  console.log(status)
  if(role!=='Admin'){
    throw new AppError("You dont have permission",403)
  }
  const course=await Course.findById(c_id)
  if(!course){
    throw new AppError("Course not found",400)
  }
  if(course.approved===true){
    throw new AppError("Already approved",400)
  }
  if(status){
    course.approved=true
    course.save();
    return res.status(200).json({success:true,data:course})
  }
  else{
    throw new AppError("Something went wrong",400)
  }
  }catch(err){
   return next(err)
  }
})
app.delete('/deleteCourse',verifyToken,async(req,res,next)=>{
    try{
      const role=req.user.role
      const id=req.user.id
      const courseId=req.query.courseId
      const author=await Course.find({author:id})
      if(role=='Student'||!author){
        throw new AppError('You dont have permission to enter this route',403)
      }
     
      const course=await Course.findOneAndDelete({ _id: courseId });
      if(!course){
        throw new AppError('Course not found',404)
      }
      res.status(200).json({success:true,message: `${course.title} Deleted Successfully`})
    }
    catch(err){
      next(err)
    }
})
app.get("/myCourse", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let courses
    if (role === "Instructor") {
       courses = await Course.find({ author: userId }).populate('author',['username']);
      if (!courses) {
        throw new AppError("Course not found",400)
      }
    } else if (role === "Student") {
      const purchase = await Purchase.find({ userId });
      if (!purchase) {
        throw new AppError("You have not purchased any course",400)
      }
      const courseId = purchase.map((purchase) => purchase.courseId);
       courses = await Course.find({ _id: { $in: courseId } }).populate('author',['username']);
      const paymentIdMap = purchase.reduce((acc, purchase) => {
        acc[purchase.courseId.toString()] = purchase.paymentId;
        return acc;
      }, {});
      courses = courses.map(course => {
        const paymentId = paymentIdMap[course._id.toString()];
        return { ...course.toObject(), paymentId }});
      }
    res.json({success:true,data:courses});
  } catch (err) {
    next(err)
  }
});

app.get("/course/:id", async (req, res) => {
  const { id } = req.params;
  const courseDoc = await Course.findById(id).populate("author", ["username"]);
  res.json(courseDoc);
});

app.post("/order/:id", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const info = req.user;
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
    if (course.author.toString() === userId) {
      throw new AppError("You cannot buy your own course", 403);
    }
    if(info.role!=='Student'){
      throw new AppError("You are restricted from buying courses",403)
    }
   
    const purchase = await Purchase.findOne({ userId, courseId });
    if (purchase) {
      throw new AppError("You have already purchased this course",400)
    } else {
      const options = req.body;
      options.receipt = shortid.generate();
      const order = await razorpay.orders.create(options);
      if (!order) {
        throw new AppError("Something went wrong, Try again later",400)
      }
      res.status(200).json(order);
    }
  } catch (err) {
    next(err)
  }
});

app.post("/order/validate/:id", verifyToken, async (req, res, next) => {
  try {
    const info = req.user;
    const courseId = req.params.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sec = crypto.createHmac("sha256", process.env.RAZORYPAY_API_SECRET);
    sec.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sec.digest("hex");
    if (digest === razorpay_signature) {
      await Purchase.create({
        userId: info.id,
        courseId,
        paymentId: razorpay_payment_id,
      });
      const course = await Course.findById(courseId);
      course.enrolled.push({student:info.id})
      await course.save()
      return res.status(200).json({success:true,payment_id:razorpay_payment_id})
    } else {
      throw new AppError("Invalid transaction",400)
    }
  } catch (err) {
   next(err)
  }
});

app.get("/getOrders",verifyToken,async(req,res,next)=>{
  const filterPayment = req?.query?.payment_id;
  let orders
  let AllOrders
  
  try {
    if(filterPayment){
      const order= await razorpay.payments.fetch(filterPayment)
      orders=[order]
     }    
     else{
     AllOrders = await razorpay.payments.all();
    orders=AllOrders.items
     }
    if (!orders) {
      throw new AppError("Currently no orders", 404);
    }
     
    const courses = await Promise.all(
      orders.map(async (order) => {
        const courses = await Purchase.find({ paymentId: order.id })
          .populate("courseId", ["title","cover"])
          .populate("userId", ["username"]);
  
        return {
          orders: order,
          courses: courses,
        };
      })
    );
  
    // const filteredCourses = filterPayment? courses.filter((course) =>
    //       course.orders.id === filterPayment): courses;
  
    return res.status(200).json({ success: true, data:courses });
      }
      catch(err){
        next(err)
      }
  })

app.get('/getInvoice',verifyToken,async(req,res,next)=>{
  try {
    const { id } =req.user.id
    const {payment_id}=req.query
    const order = await razorpay.payments.fetch(payment_id);
    const orders=[order]
    const courses = await Promise.all(
      orders.map(async (order) => {
        const courses = await Purchase.find({ paymentId: order.id })
          .populate("courseId", ["title"])
          .populate("userId", ["username"]);
  
        return {
          orders: order,
          courses: courses,
        };
      })
    );
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    next(err)
  }
})

app.post("/addLecture/:id",verifyToken,upload.single("video"),async (req, res, next) => {
    let course;
    let videoUrl={};
    try {
      const { id } = req.params;
      const info = req.user;
      course = await Course.findById(id);
      if (!course) {
        throw new AppError("Course not found", 404);
      }
      if (info.role !== "Instructor") {
        throw new AppError("You dont have permission to add lectures",400)
      }
      if (req.file) {
        const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
          folder: "video",
          resource_type: "video",
        });
        fs.unlinkSync(req.file.path);

        videoUrl.secure_url = cloudinaryRes.secure_url;
        videoUrl.public_id=cloudinaryRes.public_id;
      } else {
        throw new AppError("File not found", 404);
      }
      const { title, description } = req.body;
      course.recordings.push({
        file: videoUrl,
        filename: title,
        description,
      });
      course.total+=1
      await course.save();
      res
        .status(200)
        .json({ success: true, message: "lecture added", course });
    } catch (err) {
        next(err)
    }
  }
);

app.get("/getLectures/:id", verifyToken, async (req, res, next) => {
  try{
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  course.recordings.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  res.status(200).json({ status: true, data: course.recordings });
}
catch(err){
  next(err)
}
});

app.patch('/updateLecture/:id',verifyToken,async(req,res,next)=>{
  try{
    const {id}=req.params;
    const userId=req.user.id
    const lectureId=req.query.lecture_id

    const course=await Course.findById(id);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
    const lectureIndex = course.recordings.findIndex(
      (lecture) => lecture._id.toString() === lectureId.toString()
    );
    if (lectureIndex === -1) {
      throw new AppError('Lecture does not exist.', 404);
    }
    const studentIndex=course.enrolled.findIndex((enroll)=>String(enroll.student)===userId)
    if (studentIndex === -1) {
      throw new AppError('student does not exist.', 404);
    }
    const alreadyWatched = course.recordings[lectureIndex].watched.indexOf(userId);
    if(alreadyWatched==-1){
      course.recordings[lectureIndex].watched.push(userId)
      course.enrolled[studentIndex].totalMarks+=1
    }
    await course.save()
    res.status(200).json({success:true,data:course.recordings})
  }catch(err){
    next(err)
  }
})
app.delete('/deleteLecture/:id',verifyToken,async(req,res,next)=>{
  try{
      const {id}=req.params;
      const userId=req.user.id
      const role=req.user.role
      const lectureId=req.query.lecture_id
      const course=await Course.findById(id);
      if (!course) {
        throw new AppError("Course not found", 404);
      }
      if (role!=='Instructor') {
        throw new AppError("You are forbidden", 403);
      }
      if (course.author.toString() !== userId.toString()) {
        throw new AppError("You cannot make changes to this course", 403);
       }
      const lectureIndex = course.recordings.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
      );
      if (lectureIndex === -1) {
        throw new AppError('Lecture does not exist.', 404);
      }
      await cloudinary.uploader.destroy(
        course.recordings[lectureIndex].file.public_id,
        {
          resource_type: 'video',
        }
      );
      course.total-=1
      course.recordings.splice(lectureIndex, 1);
      await course.save()
      res.status(200).json({success:true,data:'successfully deleted'})
  }
  catch(err){
    next(err)
  }
})
app.post("/addAssignments/:id", verifyToken,uploadFile.single("pdf"),
  async (req, res, next) => {
    let course;
    let newPath;
    try {
      const { id } = req.params;
      const info = req.user;

      course = await Course.findById(id);
      if (!course) {
        throw new AppError("Course not found", 404);
      }
      if (info.role !== "Instructor") {
        throw new AppError("You are restricted from adding assignments", 400);
      }
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
      } 
      const { title, description, marks } = req.body;
      const parseMarks=parseInt(marks)
      course.assignments.push({
        title,
        description,
        marks:parseMarks,
        file: newPath,
      });
      course.total+=parseMarks
      await course.save();
     return res.status(200).json({ success: true, data: course });
    } catch (err) {
      next(err)
    }
  }
);

app.get("/getAssignments/:id", verifyToken, async (req, res, next) => {
  try {
    const user=req.user.id;
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
     course.assignments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res.status(200).json({ status: true, data: course.assignments });
  } catch (err) {
   next(err)
  }
});

app.delete('/deleteAssignment/:id',verifyToken,async(req,res,next)=>{
  try{
    const {id}=req.params;
    const userId=req.user.id
    const role=req.user.role
    const assignId=req.query.assignment_id
    const course=await Course.findById(id);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
    if (role!=='Instructor') {
      throw new AppError("You are forbidden", 403);
    }
    if (course.author.toString() !== userId.toString()) {
      throw new AppError("You cannot make changes to this course", 403);
     }
    const assignIndex = course.assignments.findIndex(
      (assign) => assign._id.toString() === assignId.toString()
    );
    if (assignIndex === -1) {
      throw new AppError('Course does not exist.', 404);
    }
    const assignmentMarks = course.assignments[assignIndex].marks;
    course.total-=assignmentMarks
    course.assignments.splice(assignIndex, 1);
    await course.save()
    res.status(200).json({success:true,data:'Deleted successfully'})
}
  catch(err){
    next(err)
  }
})

app.post("/submitAssign/:id",verifyToken,uploadFile.single("submit"),
  async (req, res, next) => {
    try {
      const info = req.user;
      const { id } = req.params;
      const { assignment_id } = req.query;
      let newPath;
      const course = await Course.findById(id);
      if (!course) {
        throw new AppError("Course not found",404)
      }
      const assignment = await course.assignments.id(assignment_id);
      if (!assignment) {
        throw new AppError("Assignment not found",404)
      }
      if (info.role !== "Student") {
        throw new AppError("Only Student can send assignment",400)
      }
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath);
      } 
      const { description } = req.body;
      assignment.submit.push({
        student: info.id,
        description,
        file: newPath,
      });
      await course.save();
     return res.status(200).json({ success: true, data: "Submitted successfully" });
    } catch (err) {
      next(err)
    }
  }
);

app.get('/assignments/:id',verifyToken,async(req,res,next)=>{
  try{
  const info=req.user.role
  const {id}=req.params
  const { assignment_id } = req.query;
  const course=await Course.findById(id)
  if(!course){
    throw new AppError("Course not found",404)
  }
  const assignment=await course.assignments.id(assignment_id)
 
  if (!assignment) {
    throw new AppError("Assignment not found",404)
  }
  const submit=assignment.submit
  const studentIds = submit.map(subdoc => subdoc.student);
  const students = await User.find({ _id: { $in: studentIds } }, 'username');
  submit.forEach(subdoc => {
    const student = students.find(student => student._id.toString() === subdoc.student.toString());
    subdoc.student = student;
  });
  submit.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  res.status(200).json({success:true,data:submit})
}
catch(err){
  next(err)
} 
})

app.put('/UpdateSubmission/:id',verifyToken,async(req,res,next)=>{
  try{
  const info=req.user.role
  const {id}=req.params
  const { assignment_id } = req.query;
  const {status,sub_id}=req.body;

  const course=await Course.findById(id)
  if(!course){
    throw new AppError("Course not found",404)
  }
  const assignment=await course.assignments.id(assignment_id)
  if (!assignment) {
    throw new AppError("Assignment not found",404)
  }
  if(info!=='Instructor'){
    throw new AppError("You dont have permission to access this route",403)
  }

  const submissionIndex = assignment.submit.findIndex((submission) => submission._id.toString() === sub_id)

  if (submissionIndex === -1) {
    throw new AppError("Submission not found",404)
  }
  const studentId = String(assignment.submit[submissionIndex].student);
  const studentIndex = course.enrolled.findIndex(enroll => String(enroll.student) === studentId);
  if (studentIndex === -1) {
    throw new AppError("Student not found",404)
      }
  if(status){
      assignment.submit[submissionIndex].status ='submitted';
      assignment.submit[submissionIndex].marks=assignment.marks
      course.enrolled[studentIndex].totalMarks += assignment.marks;
      await course.save();
      const updatedSubmission = assignment.submit.id(sub_id);
      res.status(200).json({success:true,data:updatedSubmission})
  }
else{
  res.status(400).json({success:false,data:assignment.submit,message:'You cant change the form once the it is corrected'})
}
  }
  catch(err){
    next(err)
  }
})

app.post('/contact',async(req,res,next)=>{
  try{ 
    const {username,email,message}=req.body;
    if(!username||!email||!message){
      throw new AppError('All fields are mandatory',400)
      }
      const user=await User.find({email})
      console.log(user)
      if(user.length===0){
        throw new AppError('Please login first',403)
      }
      const contact=await Contact.create({
        name:username,
        email,
        message,
      })
    res.status(200).json({success:true,data:contact})
  }catch(err){
  next(err)
}
})
app.get('/getContacts',verifyToken,async(req,res,next)=>{
  try{
  const {role}=req.user;
  if(role!=='Admin'){
    throw new AppError('You are restricted from accessing this route',400)
  }
  const contact=await Contact.find()
  res.status(200).json({success:true,data:contact})
}catch(err){
  next(err)
}
})

app.post('/certificate/:id',verifyToken,async(req,res,next)=>{
  try{
    const user=req.user
    const {id}=req.params
    const course=await Course.findById(id)
    if(!course){
      throw new AppError('Course not found',404)
    }
    const studentIndex = course.enrolled.findIndex(enroll => String(enroll.student) === user.id);
    if (studentIndex === -1) {
      throw new AppError("Student not found",404)
        }
        const marks=course.total
        const studentMarks=course.enrolled[studentIndex].totalMarks
      const studentPerc=studentMarks*100/marks
      if (studentPerc < 75) {
        throw new AppError("You need 75% or above to get the certificate", 400);
      }
    const doc=new pdfDocument({layout: 'landscape', size: 'A4'})
    const fileName = `certificate_${user.username}_${course.title}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res)

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
    const distanceMargin = 20;
    doc.fillAndStroke('#5a77d8')
        .lineWidth(20)
        .lineJoin('square')
        .rect(distanceMargin,distanceMargin,
    doc.page.width - distanceMargin * 2,
    doc.page.height - distanceMargin * 2,
  )
  .stroke();

  const logoWidth = 100; // Adjust the width of the logo as needed
  const logoX = (doc.page.width - logoWidth) / 2;
  doc.image('./uploads/logo.png',logoX,25 ,{
    fit: [logoWidth, 100],
    align:'center'
  }) .moveDown(0.5) 
  .fontSize(15).text('SKILL BITES',{align:'center'});

doc.moveDown(3)
 doc.font('Helvetica-Bold').fontSize(40).fill('#000').text(`CERTIFICATE OF COMPLETION`, { align: 'center' });
 doc.moveDown()
    doc.fontSize(14).fill('#000').text(`This is to certify that`, { align: 'center' });

    doc.font('fonts/Satisfy-Regular.ttf').fontSize(35).fill('#000').text(`${user.username}`, { align: 'center' });
  
    doc.font('Times-Roman').fontSize(14).fill('#000').text(`has successfully completed the course`, { align: 'center' });
    doc.moveDown()
    doc.font('Times-Roman').fontSize(26).fill('#000').text(`${course.title}`, { align: 'center' });
  doc.moveDown(0.5)
    doc.font('Times-Roman').fontSize(14).fill('#000').text(`with an estimated`, { align: 'center' })
    doc.font('Times-Roman').fontSize(14).fill('#A4AD32').text(`${studentPerc.toFixed(2)+'%'}`,{align:'center',underline:true});
    doc.moveDown(2)
     doc.font('Times-Roman').fontSize(14).fill('#000').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.end();
  }
  catch(err){
    next(err)
  }
})

app.get('/stats',verifyToken,async(req,res,next)=>{
  try{
    const {role}=req.user;
    const courseId=req.query.courseId
    if(role!=='Admin'){
      throw new AppError('You are restricted from accessing this route',400)
    }
    
    const studentCount = await User.countDocuments({ role: 'Student' });
    const instructorCount = await User.countDocuments({ role: 'Instructor' });
    const courseCount=await Course.countDocuments({approved:true})
    const course=await Course.findById(courseId)
    const purchases=await Purchase.find().populate('courseId',['title'])
    const paymentIds = purchases.map(purchase => purchase.paymentId);
    const payments = await razorpay.payments.all({count:100});
    let totalRevenue = 0;
   
    for (const payment of payments.items) {
      if (paymentIds.includes(payment.id) && payment.status === 'captured')
      totalRevenue+=payment.amount/100
    }
    
    res.status(200).json({success:true,studentCount,instructorCount,courseCount,totalRevenue})
  }
  catch(err){
    next(err)
  }
})
app.get('/performanceStats/:id',verifyToken,async(req,res,next)=>{
  try{
    const info=req.user
    const {id}=req.params
    const studentsPerformance = [];
    let noOfLectures
    let noOfAssignments
    let studentPerformance
    
    const course=await Course.findById(id)
    if(!course){
      throw new AppError("Course not found",404)
    }
   
    if( info.role==='Student'){
      const s_id=info?.id
    const marks=course.total
    const studentIndex = course.enrolled.findIndex(enroll => String(enroll.student) ===s_id);
      if (studentIndex === -1) {
      throw new AppError("Student not found",404)
      }
       noOfLectures=course.recordings.length;
       noOfAssignments=course.assignments.length;
      const studentMarks=course.enrolled[studentIndex].totalMarks
       studentPerformance=parseFloat(studentMarks*100/marks)
    }
    if(info.role==='Instructor'){
    const purchases=await Purchase.find({courseId:id})
    if(!purchases){
      throw new AppError("purchase not found",404)
    }
   
    for (const purchase of purchases) {
      const studentId = purchase.userId;
      const student = await User.findById(studentId);
      if (!student) {
        throw new AppError("Student not found", 404);
      }
      const marks = course.total;
      const enrolledStudent = course.enrolled.find(enroll => String(enroll.student) ===String(studentId));
      if (!enrolledStudent) {
        throw new AppError("Student not enrolled in course", 404);
      }
      const studentMarks = enrolledStudent.totalMarks;
      const percentage = parseFloat((studentMarks * 100) / marks);
      studentsPerformance.push({profile:student.photo, name:student.username,email:student.email,joined:purchase.createdAt, percentage });
    }
  }
  res.status(200).json({success:true,noOfAssignments,noOfLectures,studentPerformance,studentsPerformance})
  }
  catch(err){
    next(err)
  }
})

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
  res.send("logged out");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
app.use(ErrorHandler)
// azzKA5F0PM0S5rYv
