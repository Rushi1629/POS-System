"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Coffee,
  Lock,
  Mail,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLogin, useProfile } from "@/client/hooks/useAuth";
import SecretCafeLoader from "@/components/SecretCafeLoader";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // Existing functionality
  // =========================
  const loginMutation = useLogin();

  const { data: user } = useProfile({
    enabled: false,
  });

  useEffect(() => {
    if (user) {
      router.replace("/user-management");
    }
  }, [user, router]);

  const getDefaultRouteByRole = (roleName?: string) => {
    if (roleName === "Super Admin") return "/user-management";

    return "/dashboard";
  };

  const handleLogin = async (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    try {
      const res = await loginMutation.mutateAsync(data);

      const roleName =
        res?.user?.role?.name ?? res?.data?.role?.name ?? user?.role?.name;

      toast.success("Login successful 🎉");

      router.replace(getDefaultRouteByRole(roleName));
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const isLoading = loginMutation.isPending;
  const loginError = (loginMutation.error as Error)?.message ?? null;

  // =========================
  // New design only
  // =========================
  return (
    <>
      {/* Existing loader */}
      {isLoading && (
        <SecretCafeLoader
          message="Authenticating..."
          submessage="Verifying credentials and preparing your dashboard..."
        />
      )}

      <div className="grid min-h-screen bg-background lg:grid-cols-2">
        {/* =========================================
            LEFT SIDE - LOGIN FORM
        ========================================== */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full max-w-sm"
          >
            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </a>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso">
                <Coffee className="h-5 w-5 text-primary" />
              </span>

              <span className="font-display text-xl font-semibold">
                The Secret Cafe
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to manage orders, tables and the menu.
              </p>
            </motion.div>

            {/* Existing API Error */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                <p className="text-sm text-red-600">{loginError}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form
              className="mt-8 space-y-5"
              autoComplete="off"
              onSubmit={handleSubmit(handleLogin)}
            >
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-1.5"
              >
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="you@cafepos.app"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={`w-full rounded-xl border bg-card py-3 pr-4 pl-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring/40 ${
                      errors.email ? "border-red-500/50" : "border-input"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1.5"
              >
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`w-full rounded-xl border bg-card py-3 pr-11 pl-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring/40 ${
                      errors.password ? "border-red-500/50" : "border-input"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Remember Me */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-2"
              >
                <input
                  id="remember"
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 rounded border-input"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Keep me signed in
                </label>
              </motion.div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* =========================================
            RIGHT SIDE - HERO IMAGE
        ========================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <Image
            src="/hero-cafe.jpg"
            alt="Inside The Secret Cafe"
            fill
            priority
            sizes="50vw"
            loading="eager"
            className="object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-espresso/45" />

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.7,
            }}
            className="absolute inset-x-10 bottom-10"
          >
            <p className="font-display text-3xl font-semibold text-balance text-[#f1eadd]">
              "The best secrets are shared over coffee."
            </p>

            <p className="mt-2 text-sm text-[#f1eadd]/80">
              — The Secret Cafe team
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
