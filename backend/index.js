// Simple Express backend for ChatSupportal (demo)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// In-memory store: { conversationId: [{from, text, timestamp}] }
const conversations = {};

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Create or append message to a conversation
app.post('/api/messages', (req, res) => {
  const { conversationId, from = 'visitor', text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const id = conversationId || uuidv4();
  conversations[id] = conversations[id] || [];
  const msg = { id: uuidv4(), from, text, timestamp: new Date().toISOString() };
  conversations[id].push(msg);

  // Placeholder: send this message to Microsoft Teams / Bot Framework / Graph
  // Implement Teams or Bot Framework forwarding here using Microsoft libraries and credentials.
  console.log('[backend] received message', { conversationId: id, msg });

  res.json({ conversationId: id, message: msg });
});

// List messages in a conversation
app.get('/api/conversations/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const conv = conversations[conversationId] || [];
  res.json({ conversationId, messages: conv });
});

// Basic endpoint intended for Bot Framework webhook (optional)
app.post('/api/bot/messages', (req, res) => {
  // When integrating Bot Framework / Azure Bot Service, configure your bot to POST here.
  // For this skeleton we accept and log the incoming activity and optionally append to a conversation.
  console.log('[bot webhook] activity received:', JSON.stringify(req.body));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`ChatSupportal backend listening on port ${PORT}`));
