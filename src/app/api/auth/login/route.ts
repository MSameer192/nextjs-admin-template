import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { connectToMongoDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await connectToMongoDB();
    const { identifier, password } = await request.json();

    // Check if the identifier is an email or username and query the database accordingly
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("username companyName email _id status password"); // Selecting only necessary fields

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    if (user?.status !== "active") {
      return NextResponse.json(
        { message: `Account is not ${user?.status}`, success: false },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    // ✅ Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // ✅ Remove password field before storing user data
    const { password: _, ...userData } = user.toObject(); // Convert user document to plain object

    // ✅ Create NextResponse instance
    const response = NextResponse.json({
      message: "Welcome Back, Login successfully!",
      success: true,
    });

    // ✅ Set token in HTTP-Only Cookie
    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Protects against CSRF
      path: "/", // Available across the entire site
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    // ✅ Set user data in HTTP-Only Cookie (WITHOUT PASSWORD)
    response.cookies.set("user", JSON.stringify(userData), {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Protects against CSRF
      path: "/", // Available across the entire site
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error }, { status: 500 });
  }
}
