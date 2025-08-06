import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/chat");
    } catch {
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div className="auth-page">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPwd(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button>Se connecter</button>
      </form>
      <p><Link to="/signup">Créer un compte</Link></p>
    </div>
  );
}
