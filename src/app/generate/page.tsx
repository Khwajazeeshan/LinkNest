"use client";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormValues = {
  links: { platform: string; accountLink: string }[];
};

export default function Generate() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    defaultValues: { links: [{ platform: "", accountLink: "" }] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "links" });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post("/api/link/generate", data, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/mylinks");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page-root" style={{ minHeight: "100vh", padding: "24px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", paddingTop: "5px" }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: "28px" }}>
          <Link href="/auth/profile" style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "30px", fontWeight: "900", color: "var(--text-primary)", marginBottom: "6px" }}>Add Links</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Add the platforms and URLs you want to share on your profile.</p>
        </div>

     <form onSubmit={handleSubmit(onSubmit)} className="fade-in">
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      marginBottom: "24px",
    }}
  >
    {fields.map((field, index) => (
      <div
        key={field.id}
        className="card-sm"
        style={{
          padding: "clamp(18px, 4vw, 24px)",
          borderRadius: "14px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Link #{index + 1}
          </span>

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                background: "#fff5f5",
                color: "#ef4444",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "5px 12px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          )}
        </div>

        {/* Inputs stacked vertically */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Platform */}
          <div className="field-group">
            <label className="label">Platform</label>
            <input
              className="input"
              placeholder="e.g. Twitter"
              {...register(`links.${index}.platform`, {
                required: "Required",
                minLength: { value: 2, message: "Min 2 chars" },
              })}
            />
            {errors.links?.[index]?.platform && (
              <p className="error-text">
                {errors.links[index]?.platform?.message}
              </p>
            )}
          </div>

          {/* URL */}
          <div className="field-group">
            <label className="label">URL</label>
            <input
              className="input"
              placeholder="https://twitter.com/yourhandle"
              {...register(`links.${index}.accountLink`, {
                required: "Required",
                minLength: { value: 3, message: "Min 3 chars" },
              })}
            />
            {errors.links?.[index]?.accountLink && (
              <p className="error-text">
                {errors.links[index]?.accountLink?.message}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Actions */}
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "14px",
    }}
  >
    <button
      type="button"
      onClick={() => append({ platform: "", accountLink: "" })}
      className="btn-secondary"
      style={{
        fontSize: "14px",
        padding: "12px 22px",
        flex: "1 1 180px",
      }}
    >
      + Add Another
    </button>

    <button
      type="submit"
      className="btn-primary"
      disabled={!isValid || isSubmitting}
      style={{
        fontSize: "14px",
        padding: "12px 28px",
        flex: "1 1 200px",
      }}
    >
      {isSubmitting ? (
        <>
          <span
            className="spinner"
            style={{
              border: "3px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              width: "16px",
              height: "16px",
            }}
          ></span>{" "}
          Saving…
        </>
      ) : (
        "Save Links"
      )}
    </button>
  </div>
</form>
      </div>
    </div>
  );
}