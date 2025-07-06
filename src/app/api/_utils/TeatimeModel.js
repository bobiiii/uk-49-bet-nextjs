import mongoose from "mongoose";

const TeatimeSchema = new mongoose.Schema({
  balls: {
    type: [String], 
    required: true,
  },
  d_date: {
    type: String, 
    required: true,
  },
  resultTime: {
    type: String, 
    required: true,
  },
});

export const TeatimeModel =
  mongoose.models.Teatime || mongoose.model("Teatime", TeatimeSchema);
