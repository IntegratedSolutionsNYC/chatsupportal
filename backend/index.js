// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// In-memory stores for demo
const conversations = {}; // { conversationId: [{id, from, text, timestamp}] }
const teamsConversationRefs = {}; // { teamsConversationId: conversationReference }
const webToTeamsMap = {}; // { webConversationId: teamsConversationId }

// Bot Framework adapter (uses env vars MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD)
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID || '',
  appPassword: process.env.MICROSOFT_APP_PASSWORD || ''
});

adapter.onTurnError = async (context, error) => {
  console.error('[bot] onTurnError', error);
  try {
    await context.sendActivity('Sorry — the bot encountered an error.');
  } catch (err) {
    console.error('Failed to send onTurnError message:', err);
  }
};

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Widget: create/append message
app.post('/api/messages', async (req, res) => {
  const { conversationId, from = 'visitor', text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const id = conversationId || uuidv4();
  conversations[id] = conversations[id] || [];
  const msg = { id: uuidv4(), from, text, timestamp: new Date().toISOString() };
  conversations[id].push(msg);

  // If mapped, forward to Teams conversation proactively
  const teamsConvId = webToTeamsMap[id];
  if (teamsConvId && teamsConversationRefs[teamsConvId]) {
    const conversationReference = teamsConversationRefs[teamsConvId];
    try {
      await adapter.continueConversation(conversationReference, async (turnContext) => {
        await turnContext.sendActivity(`(From web) ${text}`);
      });
      console.log('[backend] forwarded message to Teams conversation', teamsConvId);
    } catch (err) {
      console.error('[backend] error forwarding to Teams', err);
    }
  } else {
    console.log('[backend] no Teams mapping for conversation', id);
  }

  res.json({ conversationId: id, message: msg });
});

// Read messages for widget
app.get('/api/conversations/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const conv = conversations[conversationId] || [];
  res.json({ conversationId, messages: conv });
});

// Admin endpoint: map a web conversation to a Teams conversation ID
app.post('/api/registerMapping', (req, res) => {
  const { conversationId, teamsConversationId } = req.body || {};
  if (!conversationId || !teamsConversationId) {
    return res.status(400).json({ error: 'conversationId and teamsConversationId are required' });
  }
  webToTeamsMap[conversationId] = teamsConversationId;
  res.json({ ok: true, conversationId, teamsConversationId });
});

// Bot Framework webhook endpoint
app.post('/api/bot/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    const activity = context.activity;
    const reference = TurnContext.getConversationReference(activity);
    const teamsConvId = reference && reference.conversation && reference.conversation.id;
    if (teamsConvId) {
      teamsConversationRefs[teamsConvId] = reference;
    }

    if (activity.type === 'message' && activity.text) {
      const text = activity.text.trim();
      // Support staff can send: webconv:<webConversationId> <message>
      const m = text.match(/^webconv:([a-f0-9\-]+)\s+([\s\S]+)/i);
      if (m) {
        const webConvId = m[1];
        const msgText = m[2];
        conversations[webConvId] = conversations[webConvId] || [];
        const msg = { id: uuidv4(), from: 'support', text: msgText, timestamp: new Date().toISOString() };
        conversations[webConvId].push(msg);
        await context.sendActivity(`Message forwarded to web conversation ${webConvId}`);
      } else {
        // Store in a generic teams bucket
        const genericConvId = `teams-${teamsConvId}`;
        conversations[genericConvId] = conversations[genericConvId] || [];
        const msg = { id: uuidv4(), from: 'support', text: activity.text, timestamp: new Date().toISOString() };
        conversations[genericConvId].push(msg);
      }
    }
  });
});

app.listen(PORT, () => console.log(`ChatSupportal backend listening on port ${PORT}`));
