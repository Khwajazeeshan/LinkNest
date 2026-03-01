"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type FormData = {
  Username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      if (data.password !== data.confirmPassword) return toast.error("Passwords do not match");
      const response = await axios.post("/api/auth/signup", data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/auth/checkemail?type=signup");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong during signup");
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
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Create your account</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Join millions sharing their links with LinkNest</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Username */}
            <div className="field-group">
              <label className="label" htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                placeholder="yourname"
                {...register("Username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
              />
              {errors.Username?.message && <p className="error-text">{errors.Username.message}</p>}
            </div>

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

            {/* Password row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="field-group">
                <label className="label" htmlFor="password">Password</label>
                <input id="password" type="password" className="input" placeholder="••••••••"
                  {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
                />
                {errors.password?.message && <p className="error-text">{errors.password.message}</p>}
              </div>
              <div className="field-group">
                <label className="label" htmlFor="confirm">Confirm</label>
                <input id="confirm" type="password" className="input" placeholder="••••••••"
                  {...register("confirmPassword", { required: "Required" })}
                />
                {errors.confirmPassword?.message && <p className="error-text">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", padding: "13px", marginTop: "4px", fontSize: "15px" }}>
              {isSubmitting ? (
                <><span className="spinner" style={{ border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", width: "18px", height: "18px" }}></span> Creating account…</>
              ) : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: "28px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: "700", textDecoration: "none" }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
