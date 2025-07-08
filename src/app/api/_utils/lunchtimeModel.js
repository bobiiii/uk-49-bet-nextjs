import mongoose from "mongoose";

const LunchtimeSchema = new mongoose.Schema({
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
},
{
  timestamps: true,
 }
);

export const LunchtimeModel =
  mongoose.models.Lunchtime || mongoose.model("Lunchtime", LunchtimeSchema);
