"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

type ForgetInputs = { email: string };

export default function ForgetPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgetInputs>();

  const onSubmit = async (data: ForgetInputs) => {
    try {
      const response = await axios.post("/api/auth/forgetpassword", data);
      if (response.data.success) toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="page-center" style={{ background: "var(--bg)", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 60%)" }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "20px", textDecoration: "none" }}>
              <span style={{ fontWeight: "900", fontSize: "22px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LinkNest</span>
            </Link>
            {/* Icon */}
            <div style={{ width: "60px", height: "60px", background: "var(--accent-light)", border: "1px solid var(--accent-border)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "26px" }}>🔑</div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Reset Password</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Enter your email and we&apos;ll send a recovery link</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="field-group">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                id="email"
                className="input"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" },
                })}
              />
              {errors.email?.message && <p className="error-text">{errors.email.message}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", padding: "13px", fontSize: "15px" }}>
              {isSubmitting ? (
                <><span className="spinner" style={{ border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", width: "18px", height: "18px" }}></span> Sending…</>
              ) : "Send Reset Link"}
            </button>
          </form>

          <div style={{ marginTop: "28px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Remembered it?{" "}
            <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: "700", textDecoration: "none" }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
