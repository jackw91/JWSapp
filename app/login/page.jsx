"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState("sign_in"); // "sign_in" | "sign_up"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error" | "info", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "sign_in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }
      setMessage({
        type: "info",
        text: "Account created. If email confirmation is enabled on this project, check your inbox for a confirmation link before logging in.",
      });
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#141311",
        fontFamily: "'IBM Plex Mono', monospace",
        color: "#f2ede4",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 340 }}>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            letterSpacing: "0.25em",
            color: "#c8553d",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Calgary Barbell
        </div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {mode === "sign_in" ? "Log In" : "Create Account"}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {message && (
            <div
              style={{
                fontSize: 12,
                padding: "10px 12px",
                borderRadius: 6,
                border: `1px solid ${message.type === "error" ? "#c8553d" : "#4a8752"}`,
                color: message.type === "error" ? "#e8b199" : "#a8d4a0",
              }}
            >
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Please wait…" : mode === "sign_in" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => {
            setMessage(null);
            setMode((m) => (m === "sign_in" ? "sign_up" : "sign_in"));
          }}
          style={{
            marginTop: 16,
            width: "100%",
            background: "transparent",
            border: "none",
            color: "#a89f90",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {mode === "sign_in" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  background: "#1a1815",
  border: "1px solid #3a3733",
  borderRadius: 6,
  color: "#f2ede4",
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 16,
};

const buttonStyle = {
  padding: "12px 0",
  background: "#e8d9c5",
  border: "none",
  borderRadius: 6,
  color: "#1c1a17",
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  cursor: "pointer",
  marginTop: 4,
};
