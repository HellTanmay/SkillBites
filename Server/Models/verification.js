const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const verificationSchema = new Schema(
  {
    userId: {
      type: String,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // expires: "10m",
    },
  },
  {
    timestamps: true,
  }
);

const verificationModel = model("Verification", verificationSchema);

module.exports = verificationModel;
