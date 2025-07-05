import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true },
  password: { type: String, trim: true },
});

export const UserModel =
  mongoose.models.Users || mongoose.model("Users", userSchema);
