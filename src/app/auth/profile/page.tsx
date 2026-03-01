"use client";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GrClose } from "react-icons/gr";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/auth/user");
        if (response.data.success) setUser(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Session expired. Please login again.");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const HandleDeleteAccount = async () => {
    if (!password) return toast.error("Please enter your password to confirm");
    try {
      const { data } = await axios.delete("/api/auth/deleteaccount", { data: { userId: user._id, password } });
      if (data.success) {
        toast.success(data.message);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Account deletion failed");
    } finally {
      setShowPopup(false);
      setPassword("");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <span className="spinner" style={{ width: "40px", height: "40px" }}></span>
      </div>
    );
  }

  return (
    <div className="page-root" style={{ minHeight: "100vh", padding: "32px 24px 60px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", paddingTop: "80px" }}>
        {/* Header */}
        <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", color: "var(--text-primary)", marginBottom: "6px" }}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Manage your identity, links and account security</p>
          </div>
          <Link href="/" style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "var(--surface)", border: "1.5px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-secondary)", textDecoration: "none",
            boxShadow: "var(--shadow-sm)",
          }}>
            <GrClose size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="dashboard-grid fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Profile Details */}
            <div className="card" style={{ padding: "32px" }}>
              <div className="section-title">
                <span className="accent-bar" style={{ background: "var(--accent)" }}></span>
                Profile Details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Username", value: `@${user?.Username}` },
                  { label: "Account Status", value: user?.isVerified ? "✓ Verified" : "⏳ Pending", badge: true, verified: user?.isVerified },
                  { label: "Email Address", value: user?.email, span: true },
                ].map((item) => (
                  <div key={item.label} className="card-sm" style={{ padding: "16px 20px", gridColumn: item.span ? "1 / -1" : "auto" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "6px" }}>{item.label}</p>
                    {item.badge ? (
                      <span className={item.verified ? "badge-success" : "badge-warning"} style={{ fontSize: "13px" }}>{item.value}</span>
                    ) : (
                      <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", wordBreak: "break-all" }}>{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="card" style={{ padding: "32px" }}>
              <div className="section-title">
                <span className="accent-bar" style={{ background: "#7c3aed" }}></span>
                Account Security
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
                Manage your session and authentication credentials from here.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={handleLogout} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
                  Log Out Session
                </button>
                <Link href="/auth/forgetpassword" className="btn-secondary" style={{ fontSize: "14px", padding: "10px 20px", textDecoration: "none" }}>
                  Change Password
                </Link>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Quick Actions */}
            <div className="card" style={{ padding: "28px" }}>
              <div className="section-title">
                <span className="accent-bar" style={{ background: "#0ea5e9" }}></span>
                Quick Actions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/generate" className="btn-primary" style={{ fontSize: "14px", padding: "11px 20px" }}>
                  + Add New Link
                </Link>
                <Link href="/mylinks" className="btn-secondary" style={{ fontSize: "14px", padding: "11px 20px" }}>
                  Manage My Links
                </Link>
                <Link href={`/${user?.Username}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  padding: "11px 20px", borderRadius: "12px", textDecoration: "none",
                  fontSize: "14px", fontWeight: "600", color: "var(--accent)",
                  background: "var(--accent-light)", border: "1.5px solid var(--accent-border)",
                  transition: "background 0.15s",
                }}>
                  👤 View Live Profile
                </Link>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: "var(--radius-lg)", padding: "28px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#dc2626", marginBottom: "10px" }}>Danger Zone</h2>
              <p style={{ fontSize: "13px", color: "#b91c1c", marginBottom: "18px", lineHeight: "1.6" }}>
                Once deleted, your account and all data will be permanently removed. This cannot be undone.
              </p>
              <button onClick={() => setShowPopup(true)} className="btn-danger" style={{ width: "100%", fontSize: "14px", padding: "11px" }}>
                Delete Account Permanently
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showPopup && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={() => setShowPopup(false)}></div>
          <div className="card scale-in" style={{ padding: "36px", maxWidth: "400px", width: "100%", position: "relative", zIndex: 10 }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px" }}>Confirm Deletion</h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
              Enter your password to permanently delete your account. This action cannot be reversed.
            </p>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button onClick={() => setShowPopup(false)} className="btn-secondary" style={{ padding: "12px", fontSize: "14px" }}>Cancel</button>
              <button onClick={HandleDeleteAccount} className="btn-danger" style={{ background: "#dc2626", color: "#fff", borderColor: "#dc2626", padding: "12px", fontSize: "14px" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-grid { grid-template-columns: 1fr 340px !important; }
        @media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
