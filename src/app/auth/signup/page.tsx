import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Signup from "@/components/Auth/Signup";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | NextAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page NextAdmin Dashboard Template",
  // other metadata
};

const SignUp: React.FC = () => {
  return (
    <Signup/>
  );
};

export default SignUp;
