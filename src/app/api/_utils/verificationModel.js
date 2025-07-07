// models/VerificationModel.js
import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  google: { type: String, required: false },

}, { timestamps: true });


export const VerificationModel =
  mongoose.models.Verification || mongoose.model("Verification", verificationSchema);
