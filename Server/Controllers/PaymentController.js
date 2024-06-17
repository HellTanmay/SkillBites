import razorpay from "../Razorypay.js";
import Course from "../Models/Course.js";
import Purchase from "../Models/Orders.js";
import AppError from "../utils/error.js";
import shortid from "shortid";
import crypto from "crypto";

export const createPayment=async(req,res,next)=>{
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
        if (info.role !== "Student") {
          throw new AppError("You are restricted from buying courses", 403);
        }
    
        const purchase = await Purchase.findOne({ userId, courseId });
        if (purchase) {
          throw new AppError("You have already purchased this course", 400);
        } else {
          const options = req.body;
          options.receipt = shortid.generate();
          const order = await razorpay.orders.create(options);
          if (!order) {
            throw new AppError("Something went wrong, Try again later", 400);
          }
          res.status(200).json({success:true,data:order});
        }
      } catch (err) {
        next(err);
      }
}

export const validatePayment=async(req,res,next)=>{
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
          course.enrolled.push({ student: info.id });
          await course.save();
          return res.status(200).json({ 
            success: true, 
            payment_id: razorpay_payment_id 
        });
        } else {
          throw new AppError("Invalid transaction", 400);
        }
      } catch (err) {
        next(err);
      }
}

export const fetchOrders=async(req,res,next)=>{
    const filterPayment = req?.query?.payment_id;
    let orders;
    let AllOrders;
  
    try {
      if (filterPayment) {
        const order = await razorpay.payments.fetch(filterPayment);
        orders = [order];
      } else {
        AllOrders = await razorpay.payments.all();
        orders = AllOrders.items;
      }
      if (!orders) {
        throw new AppError("Currently no orders", 404);
      }
      const courses = await Promise.all(
        orders.map(async (order) => {
          const courses = await Purchase.find({ paymentId: order.id })
            .populate("courseId", ["title", "cover"])
            .populate("userId", ["username"]);
  
          return {
            orders: order,
            courses: courses,
          };
        })
      );
      return res.status(200).json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
}

export const getOrderDetails=async(req,res,next)=>{
    try {
        const { id } = req.user.id;
        const { payment_id } = req.query;
        const order = await razorpay.payments.fetch(payment_id);
        const orders = [order];
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
        next(err);
      }
}


