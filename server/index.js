const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Multer setup pour recevoir jusqu'à 3 images en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('photos', 3);

app.post('/api/ask', upload, async (req, res) => {
  try {
    const questions = req.body.questions || '';
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ error: "Aucune photo reçue" });
    }

    function mockIAResponse(questions, numImages) {
      return {
        summary: `Analyse de ${numImages} photo(s), réponse aux questions :`,
        answers: questions.length > 0 ? `Réponses simulées pour "${questions}"` : "Aucune question donnée"
      }
    }

    const response = mockIAResponse(questions, files.length);

    res.json(response);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log(`Serveur backend Copia démarré sur le port ${port}`);
});
