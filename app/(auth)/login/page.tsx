"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Copy, CheckCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface DemoCredential {
  role: string;
  roleLabel: string;
  email: string;
  password: string;
  accent: string;
  dot: string;
}

const demoCredentials: DemoCredential[] = [
  {
    role: "admin",
    roleLabel: "Admin",
    email: "maria.alvarez@cafepos.app",
    password: "Admin@Cafe2026",
    accent: "border-red-500/40 hover:border-red-400/70 hover:bg-red-500/5",
    dot: "bg-red-400",
  },
  {
    role: "manager",
    roleLabel: "Manager",
    email: "james.okafor@cafepos.app",
    password: "Mgr@Cafe2026",
    accent: "border-sky-500/40 hover:border-sky-400/70 hover:bg-sky-500/5",
    dot: "bg-sky-400",
  },
  {
    role: "cashier",
    roleLabel: "Cashier",
    email: "priya.sharma@cafepos.app",
    password: "Cash@Cafe2026",
    accent:
      "border-emerald-500/40 hover:border-emerald-400/70 hover:bg-emerald-500/5",
    dot: "bg-emerald-400",
  },
];

async function loginUser(data: LoginFormData): Promise<DemoCredential> {
  await new Promise((r) => setTimeout(r, 1200));
  const matched = demoCredentials.find(
    (c) => c.email === data.email && c.password === data.password,
  );
  if (!matched) {
    throw new Error(
      "Invalid credentials — use the demo accounts below to sign in",
    );
  }
  return matched;
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (matched) => {
      toast.success(`Welcome back! Signed in as ${matched.roleLabel}`);
      setTimeout(() => router.push("/dashboard"), 800);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  const handleUseDemoCredential = (cred: DemoCredential) => {
    form.setFieldValue("email", cred.email);
    form.setFieldValue("password", cred.password);
    loginMutation.reset();
    setShowDemo(false);
    toast.success(`${cred.roleLabel} credentials filled in`);
  };

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // clipboard not available
    }
  };

  const isLoading = loginMutation.isPending;
  const loginError = loginMutation.error?.message ?? null;

  return (
    <div className="min-h-screen bg-[#0f0d0b] flex items-center justify-center relative overflow-hidden px-4 py-10">
      <Toaster position="top-right" richColors />

      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-125 h-125 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #b45309 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-8%] w-150 h-150 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #92400e 0%, transparent 70%)",
            animation: "pulse 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-75 h-75 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #d97706 0%, transparent 70%)",
            animation: "pulse 12s ease-in-out infinite 4s",
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-105"
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400/90 text-xs font-medium tracking-wide">
              {new Date().toDateString()}
            </span>
          </div>
        </motion.div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/[0.07] overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-35 h-35 rounded-xl flex items-center justify-center">
                <Image
                  src="/cafe_logo.png"
                  alt="The Secret Cafe"
                  width={500}
                  height={150}
                  className="mx-auto"
                  priority
                />
              </div>
              {/* <div>
                <p className="text-white font-semibold text-sm">Cafe POS</p>
                <p className="text-white/30 text-xs mt-0.5">Staff Portal</p>
              </div> */}
            </div>
            <h1 className="text-white text-2xl font-bold">Welcome back</h1>
            <p className="text-white/40 text-sm mt-1 tracking-wide">
              Sign in to start your shift
            </p>
          </div>

          {/* Form body */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="px-8 py-6"
          >
            {/* Error */}
            {loginError && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle
                  size={15}
                  className="text-red-400 mt-0.5 shrink-0"
                />
                <p className="text-sm text-red-300">{loginError}</p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email */}
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Email is required";
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                      return "Enter a valid email address";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@cafepos.app"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={`w-full px-4 py-3 text-sm text-white placeholder-white/20 rounded-xl outline-none transition-all duration-200
                        border bg-white/4
                        focus:bg-white/[0.07] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
                        ${field.state.meta.errors.length > 0 && field.state.meta.isTouched ? "border-red-500/40 bg-red-500/5" : "border-white/8 hover:border-white/[0.14]"}`}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={11} />
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </motion.div>
                )}
              </form.Field>

              {/* Password */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Password is required";
                    if (value.length < 6)
                      return "Password must be at least 6 characters";
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={`w-full px-4 py-3 pr-11 text-sm text-white placeholder-white/20 rounded-xl outline-none transition-all duration-200
                          border bg-white/4
                          focus:bg-white/[0.07] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10
                          ${field.state.meta.errors.length > 0 && field.state.meta.isTouched ? "border-red-500/40 bg-red-500/5" : "border-white/8 hover:border-white/[0.14]"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={11} />
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Remember */}
              <form.Field name="remember">
                {(field) => (
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-white/40 cursor-pointer select-none"
                    >
                      Keep me signed in
                    </label>
                  </div>
                )}
              </form.Field>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base
                  text-stone-900 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                  active:scale-[0.98]"
                style={{
                  background: isLoading
                    ? "linear-gradient(135deg, #d97706, #b45309)"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 24px rgba(245,158,11,0.3)",
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to POS</span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs mt-6 font-semibold bg-gradient-to-r from-red-400 via-yellow-300 to-red-400 bg-clip-text text-transparent"
        >
          Cafe POS · Internal staff tool · Unauthorized access is prohibited
        </motion.p>
      </motion.div>
    </div>
  );
}
