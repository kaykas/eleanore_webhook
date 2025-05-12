const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.VOICE_ID || 'Leoni Vergara';

app.post('/tts', async (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send('Missing text');

  try {
    const audio = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'stream',
      data: {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.85,
          style: 0.5,
          use_speaker_boost: true
        }
      }
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    audio.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('TTS failed');
  }
});

app.listen(3000, () => {
  console.log('Eleanore webhook listening on port 3000');
});