import { UserModel } from "@/app/api/_utils/userModel";
import { startDB } from "@/app/api/_utils/startDb";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        // Connect to database
        await startDB();

        // Check if user exists
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create token payload
        const tokenPayload = {

            email: user.email,

        };

        // Generate JWT token
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remove password from user data
        const userData = user.toObject();
        delete userData.password;

        // Set cookie if needed (optional)
        const response = NextResponse.json({
            status: "Success",
            message: "Login successful",
            token,

        });

        // You can set the token as a cookie if needed
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT_TYPE === 'DEVELOPMENT',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Server error', details: error.message },
            { status: 500 }
        );
    }
}