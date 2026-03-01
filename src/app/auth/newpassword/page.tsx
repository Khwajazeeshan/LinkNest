"use client";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type NewPasswordInputs = { newPassword: string; confirmPassword: string; };

function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewPasswordInputs>();

  const onSubmit = async (data: NewPasswordInputs) => {
    if (data.newPassword !== data.confirmPassword) return toast.error("Passwords do not match");
    if (!token) return toast.error("Invalid token");
    try {
      const response = await axios.post("/api/auth/forgetpassword", { token, newPassword: data.newPassword });
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="card" style={{ padding: "40px", maxWidth: "440px", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: "20px", textDecoration: "none" }}>
          <span style={{ fontWeight: "900", fontSize: "22px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LinkNest</span>
        </Link>
        <div style={{ width: "60px", height: "60px", background: "var(--accent-light)", border: "1px solid var(--accent-border)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "26px" }}>🔒</div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>New Password</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Create a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div className="field-group">
          <label className="label" htmlFor="newPass">New Password</label>
          <input id="newPass" type="password" className="input" placeholder="••••••••"
            {...register("newPassword", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })}
          />
          {errors.newPassword?.message && <p className="error-text">{errors.newPassword.message}</p>}
        </div>

        <div className="field-group">
          <label className="label" htmlFor="confirmPass">Confirm Password</label>
          <input id="confirmPass" type="password" className="input" placeholder="••••••••"
            {...register("confirmPassword", { required: "Required" })}
          />
          {errors.confirmPassword?.message && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", padding: "13px", fontSize: "15px" }}>
          {isSubmitting ? (
            <><span className="spinner" style={{ border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", width: "18px", height: "18px" }}></span> Saving…</>
          ) : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function NewPassword() {
  return (
    <div className="page-center" style={{ background: "var(--bg)" }}>
      <div className="fade-in" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Suspense fallback={
          <div className="card" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "440px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span className="spinner"></span>
          </div>
        }>
          <NewPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
