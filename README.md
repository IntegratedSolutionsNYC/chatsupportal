# ChatSupportal (Chats Up Portal)

Centralized chat and support portal that connects a web chat widget to Microsoft Teams threads and support/AI agents using Microsoft-native tooling.

Overview

- Web chat widget for end users (lightweight React widget)
- Each conversation opens a dedicated thread in a Microsoft Teams channel (integration point)
- Support staff and AI agents interact with the end user through Teams threads
- Message synchronization between widget and Teams is handled by the backend
- Designed for deployment to Azure (App Service, Azure Bot Service, or Azure Functions)

Quick start (local, demo)

Prerequisites
- Node.js 18+ installed
- Git

Run the backend (demo mode):
1. cd backend
2. npm install
3. copy .env.example to .env and set any optional values
4. npm start

Run the frontend demo (static widget):
1. Serve frontend/public/index.html using any static server (or open it directly in a browser)
2. The demo widget will POST messages to http://localhost:3000/api/messages by default

What this skeleton includes
- backend/ — Express server that stores conversations in-memory and exposes simple endpoints. It includes placeholders showing where to wire Microsoft Bot Framework or Graph API calls. No secrets are included.
- frontend/public/index.html — Minimal React-based chat widget (served as a static page) that demonstrates sending/receiving messages to the backend
- teams/manifest.template.json — Starter Teams app manifest template with placeholders
- docs/architecture.md — Integration notes and next steps for production deployment
- .github/workflows/node-ci.yml — Basic CI workflow that installs dependencies and runs a quick sanity check

Notes
- This skeleton is intended as a starting point for development. You will need to wire Azure/Microsoft credentials and services (Bot Service, Azure AD app, Microsoft Graph) to enable real Teams integration.
- Secrets must never be committed to the repository. Use environment variables or Azure Key Vault.

License
- This repository contains a short proprietary license file. Replace or update it with your commercial license terms or use a recognized open source license if you prefer.

Contributing
- Add issues and pull requests. For major changes, open an issue first to discuss the change.

--
GitHub Copilot Chat Assistant
