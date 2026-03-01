"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="card" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "440px", width: "100%" }}>
      <div style={{
        width: "72px", height: "72px", background: "var(--accent-light)", border: "1px solid var(--accent-border)",
        borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "32px", margin: "0 auto 20px",
      }}>📧</div>

      <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "10px" }}>Check Your Email</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginBottom: "28px" }}>
        We&apos;ve sent a <strong>{type === "signup" ? "verification" : "recovery"}</strong> link to your inbox.
        Please follow the instructions in the email to proceed.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <a href="https://gmail.com" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "13px", fontSize: "15px" }}>
          Open Gmail
        </a>
        <Link href="/auth/login" className="btn-secondary" style={{ padding: "13px", fontSize: "15px" }}>
          Return to Login
        </Link>
      </div>

      <p style={{ marginTop: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
        Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
      </p>
    </div>
  );
}

export default function CheckEmail() {
  return (
    <div className="page-center" style={{ background: "var(--bg)" }}>
      <div className="fade-in" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Suspense fallback={
          <div className="card" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "440px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span className="spinner"></span>
            <p style={{ color: "var(--text-muted)" }}>Loading…</p>
          </div>
        }>
          <CheckEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
