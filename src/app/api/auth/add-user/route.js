import { NextResponse } from "next/server";
import { UserModel } from "@/app/api/_utils/userModel";

import { startDB } from "@/app/api/_utils/startDb";
import bcrypt from 'bcryptjs';


export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await startDB();
    const user = await UserModel.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 401 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const addedUser = await UserModel.create({
      email,
      password : hashedPassword,
    });
    console.log("addedUser", addedUser);
    
    if (!addedUser) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "Success",
      message: "User added successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
