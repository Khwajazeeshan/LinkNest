"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaExternalLinkAlt, FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
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
    <div
      className="page-root"
      style={{
        minHeight: "100vh",
        padding: "60px 20px 100px",
        background: "var(--background)",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
        }}
      >
        {/* Profile Header */}
        <div
          className="fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              padding: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
              marginBottom: "18px",
            }}
          >
            <img
              src={
                userData?.profileImage ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
              }
              alt={`${userData?.Username}'s profile`}
              className="avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "6px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "var(--text-primary)",
                marginBottom: "0",
                letterSpacing: "0.5px",
              }}
            >
              @{userData?.Username}
            </h1>

          </div>

          <p
            style={{
              fontSize: "14px",
              color: "blue",
              marginBottom: "0",
            }}
          >
            {userData?.email}
          </p>
          <button
            onClick={() => {
              // const url = window.location.href;
              navigator.clipboard.writeText(userData.email);
              toast.success("Email copied!");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            title="Copy Email"
          >
            <FaCopy size={16} />
          </button>
        </div>

        {/* Links */}
        <div
          className="fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {links.length > 0 ? (
            links.map((link: any) => (
              <a
                key={link._id}
                href={link.accountLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card"
                style={{
                  textDecoration: "none",
                  padding: "18px 20px",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                  background: "#cfcfcf8e",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#4f46e5",
                      marginBottom: "4px",
                    }}
                  >
                    {link.platform}
                  </p>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "black",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      // maxWidth: "250px",
                    }}
                  >
                    {link.accountLink}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <FaExternalLinkAlt
                    size={14}
                    style={{
                      color: "black",
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText(link.accountLink);
                      toast.success(`${link.platform} link copied!`);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--border)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                    title="Copy Link"
                  >
                    <FaCopy size={16} />
                  </button>
                </div>
              </a>
            ))
          ) : (
            <div
              className="card"
              style={{
                padding: "50px 24px",
                textAlign: "center",
                borderRadius: "14px",
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                This user hasn&apos;t added any links yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div
          style={{
            textAlign: "center",
            marginTop: "64px",
            paddingTop: "28px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Powered by{" "}
            <strong
              style={{
                color: "var(--accent)",
                letterSpacing: "0.5px",
              }}
            >
              LinkNest
            </strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
