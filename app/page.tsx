"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import HomePage from "@/components/home/Home";

export default function Home() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col text-[#f5e6c8] px-4 relative overflow-x-hidden p-0">
      <HomePage/>
    </div>
  );
}
