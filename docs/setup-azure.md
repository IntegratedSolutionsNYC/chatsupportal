# Setup for Azure Bot and Teams (development)

1. Register an Azure AD app / Azure Bot (Azure Portal)
   - Create a Bot Channels Registration (Azure Bot) or use the Bot Framework registration.
   - Capture the Microsoft App ID and generate a password (client secret). Set these as MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD in your environment.

2. Expose your local backend for development
   - Use ngrok: `ngrok http 3000`
   - Set the bot messaging endpoint to `https://<ngrok-id>.ngrok.io/api/bot/messages`

3. Sideload the Teams app
   - Use the `teams/manifest.template.json`, replace <BOT_APP_ID> and manifest id with GUIDs and zip up the manifest and icon files.
   - Upload to Teams (Developer Portal or App Studio) and add the bot to a channel.

4. Obtain the Teams conversation id
   - Send a message from the channel to the bot. The backend will log the captured teams conversation id (or store it in memory).

5. Map a web conversation to a Teams conversation
   - From your frontend widget, send a message and get the conversationId from the backend response.
   - Call POST /api/registerMapping with body `{ "conversationId": "<webConversationId>", "teamsConversationId": "<teamsConversationId>" }`.

6. Test end-to-end
   - Send messages from widget; they will be forwarded to Teams if the mapping exists.
   - In Teams, to forward a message back to the widget conversation (demo-only), send: `webconv:<conversationId> Your reply here`.

Notes
- For production, replace the in-memory stores with a persistent database, secure endpoints, and use Key Vault for secrets.
