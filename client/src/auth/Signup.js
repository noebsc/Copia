import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      nav("/chat");
    } catch {
      setError("Erreur à la création...");
    }
  };

  return (
    <div className="auth-page">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPwd(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button>Créer</button>
      </form>
      <p><Link to="/login">Déjà inscrit ? Connexion</Link></p>
    </div>
  );
}
