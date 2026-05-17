"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-[#f5e6c8] px-4 relative overflow-x-hidden">
      {/* Logo Animation */}

       <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Image
            src="/cafe_logo.png"
            alt="The Secret Cafe"
            width={220}
            height={220}
            className="mx-auto"
            priority
          />
        </motion.div>

        {/* Title Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-center mb-2"
        >
          Welcome to The Secret Cafe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm md:text-base text-[#c8a97e] mb-10"
        >
          Your secret place for every occasion 🍽️
        </motion.p>

        {/* Buttons Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-4 w-full max-w-xs"
        >
          {/* Scan QR */}
          <Link
            href="/customer"
            className="w-full text-center bg-[#7a1f1f] hover:bg-[#a52a2a] transition text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            Scan QR
          </Link>

          {/* Login */}
          <button
            onClick={handleLoginRedirect}
            className="w-full text-center border border-[#c8a97e] hover:bg-[#c8a97e] hover:text-black transition py-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </motion.div>

        {/* Floating Background Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
          className="absolute w-75 h-75 bg-[#7a1f1f] blur-3xl rounded-full top-10 left-10"
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
