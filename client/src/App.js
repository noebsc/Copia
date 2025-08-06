import React, { useState } from 'react';

function App() {
  const [photos, setPhotos] = useState([]);
  const [questions, setQuestions] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = e => {
    if (e.target.files.length > 3) {
      alert("Tu peux envoyer maximum 3 photos");
      return;
    }
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      alert("Merci d'ajouter au moins une photo");
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    photos.forEach(photo => formData.append('photos', photo));
    formData.append('questions', questions);

    try {
      const res = await fetch('http://localhost:4000/api/ask', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Erreur serveur");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial' }}>
      <h2>Copia - Réponse automatique aux copies</h2>
      <form onSubmit={handleSubmit}>
        <label>Photos (max 3) :</label><br />
        <input type="file" accept="image/*" multiple onChange={handlePhotoChange} /><br /><br />

        <label>Questions / détails :</label><br />
        <textarea
          rows="4"
          cols="50"
          value={questions}
          onChange={e => setQuestions(e.target.value)}
          placeholder="Tape tes questions ici..."
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Traitement...' : 'Envoyer à l’IA'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result &&
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Réponse IA :</h3>
          <p><strong>{result.summary}</strong></p>
          <p>{result.answers}</p>
        </div>
      }
    </div>
  );
}

export default App;
