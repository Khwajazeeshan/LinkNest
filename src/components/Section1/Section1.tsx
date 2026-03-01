"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Section1() {


  const [username, setUsername] = useState(""); // 👈 controlled input

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/auth/user");
        if (response.data.success) {
          setUsername(response.data.data.Username); // 👈 set username (capital U)
        }
      } catch (error: any) {
        console.log(
          "Session expired. Please login again."
        );
      }
    };
    getUser();
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">

          {/* ── Left Column ── */}
          <div className="hero-left fade-in">
            {/* Badge */}
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">The new standard for creators</span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              Everything you are.{" "}
              <span className="hero-headline-gradient">
                One simple link.
              </span>
            </h1>

            {/* Subtext */}
            <p className="hero-subtext">
              Join millions using LinkNest for their link-in-bio. One link to share
              everything you create, curate and sell across all your platforms.
            </p>

            {/* CTA Row */}
            <div className="hero-cta-wrap">
              <div className="hero-cta-box">
                <span className="hero-cta-prefix">linknest.co/</span>

                <input
                  type="text"
                  placeholder="yourname"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  className="hero-cta-input"
                />

                <button
                  onClick={() => router.push("/generate")}
                  disabled={!username?.trim()}
                  className="btn-primary hero-cta-btn"
                >
                  Claim your Link
                </button>

              </div>
              <p className="hero-cta-note">It&apos;s free, and takes less than a minute.</p>
            </div>
          </div>

          {/* ── Right Column — Phone Mockup ── */}
          <div className="hero-right fade-in">
            {/* Glow */}
            <div className="hero-glow" />

            {/* Phone Shell */}
            <div className="hero-phone">
              {/* Notch */}
              <div className="hero-notch" />

              {/* Screen */}
              <div className="hero-screen">
                {/* Avatar */}
                <div className="hero-avatar">Y</div>
                <p className="hero-screen-name">@yourname</p>
                <p className="hero-screen-bio">Creator &amp; Developer</p>

                {/* Links */}
                {["Portfolio", "YouTube", "Instagram"].map((item, i) => (
                  <div key={i} className="hero-link-card-mini">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="hero-stats fade-in">
          {[["50M+", "Active Users"], ["190+", "Countries"], ["99.9%", "Uptime"], ["Free", "Always"]].map(([val, label]) => (
            <div key={label} className="hero-stat">
              <p className="hero-stat-val">{val}</p>
              <p className="hero-stat-label">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}