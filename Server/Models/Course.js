const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength:35,
    },
    summary: {
      type: String,
      required: true,
      maxlength:100,
    },
    content: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
     max:12
    },
    price: {
      type: Number,
      required: true,
      max: 10000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    total:{
      type:Number,
      default:0,
    },
    enrolled:[{
     student:{
      type:Schema.Types.ObjectId,
      ref:'User',
    },
      totalMarks:{
        type:Number,
        default:0,
      },
    }],
    approved:{
      type:Boolean,
      default:false,
    },
    recordings: [
      {
        file: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
        filename: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        watched:[{
          type:Schema.Types.ObjectId,
          ref:'User',
        }],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    assignments: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,    
        },
        file: {
          type: String,
        },
        marks:{
          type:Number,
           default:0, 
        },
        createdAt: {
          type: Date,
          default:Date.now()
        },
        submit: [
          {
            student: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            file: {
              type: String,
            },
            description: {
              type: String,
            },
            submittedAt: {
              type: Date,
              default:Date.now(),
            },
            status: {
              type: String,
              enum: ["pending", "submitted"],
              default: "pending",
            },
            marks: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  quizz:[{
    title:{
      type:String,
      required:true
    },
    file:{
      type:String,
      required:true,
    },
    mark:{
      type:Number,
      default:1,
    },
    duration:{
      type:Number,
    },
    totalmarks:{
      type:Number,
    },
    createdAt:{
      type:Date,
      default:Date.now(),
    },
    submitQuiz:[{
      student:{
        type:Schema.Types.ObjectId,
        ref:'User',
      },
      marks:{
        type:Number,
      },
      submittedAt:{
        type:Date,
        default:Date.now()
      }
    }]
  }]
  },
  {
    timestamps: true,
  }
);

const CourseModel = model("course", CourseSchema);

module.exports = CourseModel;
