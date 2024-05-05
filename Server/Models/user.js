const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt=require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


const UserSchema = new Schema({
  username: { type: String,
               required: [true, "Username is required "],
               maxlength:[15,"Username should not exceed 15 characters"]
              },
  email: {
    unique: true,
    type: String,
    required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
 role: {
  type:String,
  enum:['Admin','Student','Instructor'],
 },
  password: { 
    type: String, 
    required: [true,"Please enter a password"],
     minlength: [8,"password must be of 8 characters long"]
    },
  photo:{
    type:String,
    default:'https://res.cloudinary.com/djp33bnwu/image/upload/v1710756211/avatar/bmhghzxpe78gdntcl4zg.jpg',
  },
  gender:{
    type:String,
    default:'Male',
  },
  bio:{
    type:String,
    default:'N/a',
  },
  address:{
    type:String,
    default:'N/a'
  },
  phone: {
    type: String,
    default: 'N/a',
    maxlength: [10, "Phone number should not exceed 10 characters"],
  }
},
{
  timestamps:true
});
UserSchema.pre ('save',async function(next){
  if(this.isModified('password')||this.isNew){
  this.password= await bcrypt.hashSync(this.password, salt),
  next();
  }

})

const UserModel = model("User", UserSchema);

module.exports = UserModel;
