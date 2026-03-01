"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const verifyToken = useCallback(async () => {
    if (!token) { setVerifying(false); return; }
    try {
      const response = await axios.post("/api/auth/verifyemail", { token });
      if (response.data.type === "verify") {
        setVerified(true);
        toast.success("Email verified successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  }, [token]);

  useEffect(() => { verifyToken(); }, [verifyToken]);

  return (
    <div className="card" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "440px", width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        {verifying ? (
          <div style={{ display: "flex", justifyContent: "center" }}><span className="spinner" style={{ width: "48px", height: "48px" }}></span></div>
        ) : verified ? (
          <div style={{ width: "72px", height: "72px", background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "30px" }}>✓</div>
        ) : (
          <div style={{ width: "72px", height: "72px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "30px" }}>✗</div>
        )}
      </div>

      <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "10px" }}>
        {verifying ? "Verifying…" : verified ? "Email Verified!" : "Verification Failed"}
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginBottom: "28px" }}>
        {verifying
          ? "Please wait while we verify your email address."
          : verified
            ? "Your email has been verified. You can now access all features."
            : "The verification link is invalid or has expired. Please try again."}
      </p>

      {!verifying && (
        <Link href={verified ? "/auth/login" : "/auth/signup"} className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: "15px" }}>
          {verified ? "Continue to Login" : "Back to Signup"}
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="page-center" style={{ background: "var(--bg)" }}>
      <div className="fade-in" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Suspense fallback={
          <div className="card" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "440px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span className="spinner"></span>
            <p style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
