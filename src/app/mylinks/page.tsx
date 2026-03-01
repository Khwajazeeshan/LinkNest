"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaCamera, FaCopy } from "react-icons/fa";
import Link from "next/link";

export default function MyLinks() {
  const [links, setLinks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPlatform, setEditPlatform] = useState("");
  const [editAccountLink, setEditAccountLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await axios.get("/api/link/links");
        if (response.data.success) setLinks(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    };
    const getUser = async () => {
      try {
        const response = await axios.get("/api/auth/user");
        if (response.data.success) setUser(response.data.data);
      } catch { /* silent */ }
    };
    getLinks();
    getUser();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const toastId = toast.loading("Uploading image…");
      const response = await axios.post("/api/user/profile-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.data.success) {
        setUser({ ...user, profileImage: response.data.imageUrl });
        toast.success("Profile image updated!", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleCopy = () => {
    if (!user) return;
    const url = `${process.env.NEXT_PUBLIC_DOMAIN || window.location.origin}/${user.Username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/link/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        setLinks(links.filter((l) => l._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const startEdit = (link: any) => {
    setEditId(link._id);
    setEditPlatform(link.platform);
    setEditAccountLink(link.accountLink);
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`/api/link/${id}`, { platform: editPlatform, accountLink: editAccountLink });
      if (response.data.success) {
        toast.success(response.data.message);
        setLinks(links.map((l) => l._id === id ? { ...l, platform: editPlatform, accountLink: editAccountLink } : l));
        setEditId(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const profileUrl = user ? `${process.env.NEXT_PUBLIC_DOMAIN || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")}/${user.Username}` : "";

  return (
    <div className="page-root" style={{ minHeight: "100vh", padding: "24px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", paddingTop: "96px" }}>

        {/* Profile Card */}
        <div className="card fade-in" style={{ padding: "36px", textAlign: "center", marginBottom: "24px" }}>
          {/* Back link */}
          <div style={{ position: "absolute", top: "20px", left: "20px" }}>
            <Link href="/auth/profile" style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              ← Dashboard
            </Link>
          </div>

          {/* Avatar */}
          <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 20px" }}>
            <img
              src={user?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
              alt="Profile"
              className="avatar"
              style={{ width: "100px", height: "100px" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: "0", right: "0",
                background: "var(--accent)", color: "#fff",
                border: "2px solid var(--surface)", borderRadius: "50%",
                width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "var(--shadow)",
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
              title="Update Profile Photo"
            >
              <FaCamera size={13} />
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "4px" }}>
            {user?.Username ? `@${user.Username}` : "Your Profile"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>{user?.email}</p>

          {/* URL bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--surface-2)", border: "1.5px solid var(--border)",
            borderRadius: "12px", padding: "10px 14px",
            fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500",
          }}>
            <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profileUrl || "Loading…"}</span>
            {user && (
              <button onClick={handleCopy} className="btn-icon" style={{ flexShrink: 0 }} title="Copy link">
                <FaCopy size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Links List */}
        <div className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
              My Links <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>({links.length})</span>
            </h2>
            <Link href="/generate" className="btn-primary" style={{ fontSize: "13px", padding: "8px 16px", borderRadius: "10px" }}>
              + Add Link
            </Link>
          </div>

          {links.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {links.map((link: any) => (
                <div key={link._id} className="card-sm" style={{ padding: "20px 22px" }}>
                  {editId === link._id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div className="field-group">
                        <label className="label">Platform Name</label>
                        <input className="input" value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} placeholder="Platform name" />
                      </div>
                      <div className="field-group">
                        <label className="label">URL</label>
                        <input className="input" value={editAccountLink} onChange={(e) => setEditAccountLink(e.target.value)} placeholder="https://..." />
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => handleUpdate(link._id)} className="btn-primary" style={{ flex: 1, padding: "10px", fontSize: "14px" }}>Save Changes</button>
                        <button onClick={() => setEditId(null)} className="btn-secondary" style={{ flex: 1, padding: "10px", fontSize: "14px" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-primary)", marginBottom: "2px" }}>{link.platform}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.accountLink}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button onClick={() => startEdit(link)} className="btn-icon" title="Edit">
                          <FaEdit size={15} />
                        </button>
                        <button onClick={() => handleDelete(link._id)} className="btn-icon" title="Delete"
                          style={{ color: "#ef4444", background: "#fff5f5", borderColor: "#fecaca" }}
                          onMouseEnter={e => { (e.currentTarget.style.background = "#ef4444"); (e.currentTarget.style.color = "#fff"); }}
                          onMouseLeave={e => { (e.currentTarget.style.background = "#fff5f5"); (e.currentTarget.style.color = "#ef4444"); }}
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔗</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px" }}>No Links Yet</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
                Add your first link and start building your profile.
              </p>
              <Link href="/generate" className="btn-primary" style={{ fontSize: "14px", padding: "11px 24px" }}>
                Add Your First Link
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}