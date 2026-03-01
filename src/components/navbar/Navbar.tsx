"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedin, setLoggedin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    axios.get("/api/auth/user")
      .then((res) => { if (res.data.success) setLoggedin(true); })
      .catch(() => setLoggedin(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (pathname is stable, router object is not)
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        toast.success("Logged out successfully");
        setLoggedin(false);
        setMenuOpen(false);
        router.push("/auth/login");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <nav className={`linknest-nav${scrolled ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">L</div>
            <span className="nav-logo-text">LinkNest</span>
          </Link>

          {/* Desktop actions */}
          <div className="nav-actions-desktop">
            {loggedin ? (
              <>
                <button onClick={handleLogout} className="nav-link-btn">
                  Logout
                </button>
                <Link href="/auth/profile" className="btn-primary nav-btn-sm">
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link-btn">
                  Log in
                </Link>
                <Link href="/auth/signup" className="btn-primary nav-btn-sm">
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`nav-drawer${menuOpen ? " drawer-open" : ""}`}>
          <div className="nav-drawer-inner">
            {loggedin ? (
              <>
                <Link href="/auth/profile" className="btn-primary nav-drawer-btn" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
                <button onClick={handleLogout} className="nav-drawer-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="btn-primary nav-drawer-btn" onClick={() => setMenuOpen(false)}>
                  Sign up free
                </Link>
                <Link href="/auth/login" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}