const Razorpay = require("razorpay");

const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORYPAY_API_SECRET,
});
module.exports=razorpay