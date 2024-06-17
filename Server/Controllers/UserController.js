import User from "../Models/user.js";
import Verification from "../Models/verification.js";
import Purchase from "../Models/Orders.js";
import Course from "../Models/Course.js";

import fs from "fs";
import bcrypt from "bcryptjs";
import cloudinary from "../cloudinary.js";
import { Token } from "../Middleware/authMid.js";
import AppError from "../utils/error.js";
import sendEmail from "../utils/sendMail.js";


export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const userDoc = await User.create({
      username,
      email,
      password,
      role,
    });
    const otp = Math.floor(1000 + Math.random() * 9000);
    const hashedOtp = await bcrypt.hashSync(otp.toString(), 10);
    const verification = await Verification.create({
      userId: userDoc._id,
      otp: hashedOtp,
    });
    verification.save();
    await sendEmail(
      email,
      "Verification Email",
      `<p>Your verification code is <p><b> ${otp} </b></p></p>`
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: userDoc,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!email || !otp) {
      throw new AppError("Try again", 400);
    }
    const verification = await Verification.findOne({ userId: user._id });
    if (!verification) {
      throw new AppError("Token expired!", 404);
    }
    const isOtpMatch = await bcrypt.compare(otp.toString(), verification.otp);
    if (!isOtpMatch) {
      throw new AppError("Invalid otp");
    }
    await User.updateOne({ _id: user._id }, { verified: true });
    await verification.deleteOne({ userId: user._id });

    const token = Token(user);
    res.cookie("token", token, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
      sameSite: "Lax",
    });
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export const resend_otp = async (req, res, next) => {
  try {
    const { user_id, email } = req.body;
    const user = User.findById(user_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

     await Verification.findOneAndUpdate(
      { userId: user_id },
      { otp: hashedOtp },
      { new: true, upsert: true }
    );
    await sendEmail(
        email,
      "Resend Verification Email",
      `<p>Your new verification code is <b>${otp}</b></p>`
    );

    res.status(200).json({ 
        success: true, 
        message: "New OTP sent successfully" 
    });
  } catch (err) {
    next(err);
  }
};

export const login=async(req,res,next)=>{
    try {
        const { email, password } = req.body;
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
          throw new AppError("User not found", 404);
        }
        if (userDoc.verified === false) {
          return res.status(200).json({
              success: "verify",
              data: userDoc,
              message: "User not verified. Please complete the OTP verification.",
            });
        } else {
          const passOk = bcrypt.compareSync(password, userDoc.password);
          if (passOk) {
            const token = Token(userDoc);
            res.cookie("token", token, {
              maxAge: 60 * 60 * 24 * 1000,
              httpOnly: true,
            });
            res.status(200).json({ success: true, token, role: userDoc.role });
          } else {
            throw new AppError("Wrong password", 400);
          }
        }
      } catch (err) {
        next(err);
      }
}

export const verify=async(req,res,next)=>{
    const info = req.user;
    res.status(200).json(info);
}

export const profile=async(req,res,next)=>{
    try {
        let userId = req.user.id;
        const userDoc = await User.findById(userId).select("-password");
        if (!userDoc) {
          throw new AppError("User not found", 404);
        } 
          res.json(userDoc);
        
      } catch (error) {
        next(error);
      }
    
}

export const userProfile=async(req,res,next)=>{
  try {
      let {userId} = req.query;
      const userDoc = await User.findById(userId).select("-password");
      if (!userDoc) {
        throw new AppError("User not found", 404);
      } else {
        res.json(userDoc);
      }
    } catch (error) {
      next(error);
    }
  
}

export const editProfile=async(req,res,next)=>{
    let imageUrl;
    try {
      if (req.file) {
        const cloudRes = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatar",
        });
        fs.unlinkSync(req.file.path);
        imageUrl = cloudRes.secure_url;
      }
      const { phone } = req.body;
      if (!/^\d{10}$/.test(phone)) {
        throw new AppError("Please provide a valid mobile number", 400);
      }

      const updateData = {
        ...(imageUrl && { photo: imageUrl }),
        ...req.body,
      };
      const info = req.user;
      const userDoc = await User.findByIdAndUpdate(info.id, updateData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ success: true, userDoc });
    } catch (err) {
      next(err);
    }
}

export const getAllUser=async(req,res,next)=>{
    try {
        const users = await User.find({ role: "Student" }).select("-password");
        const purchases = await Promise.all(
          users.map(async (user) => {
            const purchases = await Purchase.find({ userId: user._id }).populate(
              "courseId",
              ["title"]
            );
            return {
              user: user.toObject(),
              purchases: purchases.map((purchase) => purchase.toObject()),
            };
          })
        );
        const instructors = await User.find({ role: "Instructor" }).select(
          "-password"
        );
        const courses = await Promise.all(
          instructors.map(async (user) => {
            const courses = await Course.find({ author: user._id });
            return {
              instructor: user.toObject(),
              courses: courses.map((course) => course.toObject()),
            };
          })
        );
        res.status(200).json({ success: true, data: purchases, data2: courses });
      } catch (error) {
        next(err);
      }
}

export const Logout=async(req,res,next)=>{
  res.cookie("token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "Lax",
  });
  res.status(200).json({success:true,message:'Logged out'})
}