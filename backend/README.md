# ChatSupportal backend (updated)

This backend includes a simple Bot Framework integration for demo/proof-of-concept. It stores conversations in memory and allows mapping a web conversation to a Teams conversation ID so messages can be forwarded proactively.

Important environment variables (do not commit secrets):
- MICROSOFT_APP_ID
- MICROSOFT_APP_PASSWORD
- PORT (optional)

Endpoints:
- GET /health
- POST /api/messages  -- body: { conversationId?, from?, text }
- GET /api/conversations/:conversationId
- POST /api/registerMapping -- body: { conversationId, teamsConversationId }
- POST /api/bot/messages -- Bot Framework webhook

Run locally:
1. cd backend
2. npm install
3. Set MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD in your environment (or leave blank for local demo)
4. npm start

For Teams integration during development, expose your backend with ngrok and set the bot messaging endpoint to https://<ngrok-id>.ngrok.io/api/bot/messages
