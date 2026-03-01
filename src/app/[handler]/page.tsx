"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export default function PublicProfile() {
  const params = useParams();
  const handler = params.handler as string;

  const [userData, setUserData] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/api/${handler}`);
        if (response.data.success) {
          setUserData(response.data.data.user);
          setLinks(response.data.data.links);
        }
      } catch (error: any) {
        if (error.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (handler) fetchProfileData();
  }, [handler]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "var(--bg)" }}>
        <span className="spinner" style={{ width: "40px", height: "40px" }}></span>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading profile…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px", background: "var(--bg)" }}>
        <div style={{ fontSize: "80px", fontWeight: "900", color: "var(--accent)", lineHeight: "1", marginBottom: "8px" }}>404</div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>User Not Found</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "400px", lineHeight: "1.7", marginBottom: "28px" }}>
          We couldn&apos;t find the profile{" "}
          <code style={{ background: "var(--accent-light)", color: "var(--accent)", borderRadius: "6px", padding: "2px 8px", fontSize: "14px", fontWeight: "700" }}>@{handler}</code>.
          They may have changed their username or deleted their account.
        </p>
        <Link href="/" className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="page-root" style={{ minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "36px", paddingTop: "24px" }}>
          <img
            src={userData?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
            alt={`${userData?.Username}'s profile`}
            className="avatar"
            style={{ width: "96px", height: "96px", marginBottom: "16px" }}
          />
          <h1 style={{ fontSize: "26px", fontWeight: "900", color: "var(--text-primary)", marginBottom: "4px" }}>
            @{userData?.Username}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "0" }}>{userData?.email}</p>
        </div>

        {/* Links */}
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {links.length > 0 ? (
            links.map((link: any) => (
              <a
                key={link._id}
                href={link.accountLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card"
                style={{ textDecoration: "none" }}
              >
                <div>
                  <p style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-primary)", marginBottom: "2px" }}>{link.platform}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>{link.accountLink}</p>
                </div>
                <FaExternalLinkAlt size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </a>
            ))
          ) : (
            <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>This user hasn&apos;t added any links yet.</p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div style={{ textAlign: "center", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", fontWeight: "500" }}>
            Powered by <strong style={{ color: "var(--accent)" }}>LinkNest</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
