"use client";
import { useState } from "react";
import { auth } from "@/firebase"; // Adjust the path if needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <form onSubmit={handleLogin}>
        <button type="submit">Log In</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}