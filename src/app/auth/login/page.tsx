"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post("/api/auth/login", data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page-center" style={{ background: "var(--bg)", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 60%)" }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        <div className="card" style={{ padding: "40px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "20px", textDecoration: "none" }}>
              <span style={{
                fontWeight: "900", fontSize: "22px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>LinkNest</span>
            </Link>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Welcome back</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Log in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div className="field-group">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                id="email"
                className="input"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                })}
              />
              {errors.email?.message && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="field-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="label" htmlFor="password">Password</label>
                <Link href="/auth/forgetpassword" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", fontWeight: "600" }}>
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password?.message && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", padding: "13px", marginTop: "4px", fontSize: "15px" }}>
              {isSubmitting ? (
                <><span className="spinner" style={{ border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", width: "18px", height: "18px" }}></span> Signing in…</>
              ) : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "28px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "var(--accent)", fontWeight: "700", textDecoration: "none" }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
