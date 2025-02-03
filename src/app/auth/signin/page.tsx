import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import Login from "@/components/Auth/Login";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | NextAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page NextAdmin Dashboard Template",
};

const SignIn: React.FC = () => {
  return (
    <Login />
  );
};

export default SignIn;
