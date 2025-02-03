import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectToMongoDB();
    const { name, email, password, companyName } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      companyName,
    });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // ✅ Create NextResponse instance
    const response = NextResponse.json({
      message: "Welcome, User registered successfully",
      success: true,
    });

    // ✅ Set token in HTTP-Only Cookie
    response.cookies.set('token', token, {
      httpOnly: true,  // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: 'strict', // Protects against CSRF
      path: '/', // Available across the entire site
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
