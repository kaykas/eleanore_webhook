const express = require('express');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const stream = require('stream');

const app = express();
app.use(express.json());

ffmpeg.setFfmpegPath(ffmpegPath);

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.VOICE_ID || 'YOUR_VOICE_ID_HERE';

app.post('/tts', async (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send('Missing text');

  try {
    const elevenStream = await axios({
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

    res.setHeader('Content-Type', 'audio/wav');

    const ffmpegStream = ffmpeg()
      .input(elevenStream.data)
      .inputFormat('mp3')
      .audioCodec('pcm_mulaw')
      .audioFrequency(8000)
      .audioChannels(1)
      .format('wav')
      .on('error', (err) => {
        console.error('FFmpeg error:', err.message);
        res.status(500).send('Audio conversion failed');
      })
      .pipe(res, { end: true });

  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).send('TTS failed');
  }
});

app.listen(3000, () => {
  console.log('Eleanore webhook with WAV output running on port 3000');
});