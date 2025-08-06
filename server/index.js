const express = require('express');
const cors = require('cors');
const multer = require('multer');
// Import fetch compatible CommonJS (Render)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('photos', 3);

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_API_KEY = process.env.COPIA_API_KEY;

app.post('/api/ask', upload, async (req, res) => {
  try {
    const questions = req.body.questions || '';
    const files = req.files || [];

    if (files.length === 0) return res.status(400).json({ error: "Aucune photo reçue" });

    const imagePrompts = files.map(file => ({
      inlineData: {
        mimeType: file.mimetype,
        data: file.buffer.toString('base64')
      }
    }));

    const multiModalMessages = [
      { role: "user", parts: [{ text: questions }, ...imagePrompts] }
    ];

    const body = { contents: multiModalMessages };
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Réponse Copia non OK : ${text}`);
    }

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse IA reçue.";

    res.json({
      summary: `Analyse IA de ${files.length} photo(s) envoyée(s) avec texte/question fourni.`,
      answers: result,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur IA : ' + (e.message || e) });
  }
});

app.get('/', (req, res) => {
  res.send("Bienvenue sur l’API Copia. Utilisez POST /api/ask.");
});

app.listen(port, () => {
  console.log(`Serveur Copia démarré sur le port ${port}`);
});
