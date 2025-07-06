import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  drawType: {
    type: String,
    enum: ['Lunchtime', 'Teatime'],  // add more types if needed
    required: true,
  },
  numbers: {
    type: [Number],
    validate: {
      validator: function (arr) {
        return arr.length === 3 && arr.every(num => num >= 1 && num <= 49);
      },
      message: 'Exactly 3 numbers between 1 and 49 are required',
    },
    required: true,
  },
  confidenceLevel: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active',
  },

},
{ timestamps: true }
);



export const PredictionModel =
  mongoose.models.Prediction || mongoose.model("Prediction", predictionSchema);

