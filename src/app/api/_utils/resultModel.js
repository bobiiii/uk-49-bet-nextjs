import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  drawType: {
    type: String,
    enum: ['Lunchtime', 'Teatime'],
    required: true,
  },
  drawDate: {
    type: Date,
    required: true,
  },
  drawTime: {
    type: String,
     default: () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // e.g. "14:25:36"
  },
  },
  numbers: {
    type: [Number],
    required: true,
  },
  bonus: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


export const ResultModel =
  mongoose.models.Results || mongoose.model("Results", resultSchema);
