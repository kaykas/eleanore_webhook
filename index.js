{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const axios = require('axios');\
const app = express();\
app.use(express.json());\
\
const apiKey = process.env.ELEVENLABS_API_KEY;\
const voiceId = process.env.VOICE_ID || 'Leoni Vergara';\
\
app.post('/tts', async (req, res) => \{\
  const text = req.body.text;\
  if (!text) return res.status(400).send('Missing text');\
\
  try \{\
    const audio = await axios(\{\
      method: 'POST',\
      url: `https://api.elevenlabs.io/v1/text-to-speech/$\{voiceId\}/stream`,\
      headers: \{\
        'xi-api-key': apiKey,\
        'Content-Type': 'application/json'\
      \},\
      responseType: 'stream',\
      data: \{\
        text,\
        model_id: 'eleven_multilingual_v2',\
        voice_settings: \{\
          stability: 0.3,\
          similarity_boost: 0.85,\
          style: 0.5,\
          use_speaker_boost: true\
        \}\
      \}\
    \});\
\
    res.setHeader('Content-Type', 'audio/mpeg');\
    audio.data.pipe(res);\
  \} catch (err) \{\
    console.error(err.message);\
    res.status(500).send('TTS failed');\
  \}\
\});\
\
app.listen(3000, () => \{\
  console.log('Eleanore webhook listening on port 3000');\
\});}