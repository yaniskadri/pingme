# PingMe (Discord Webhook Relay on Netlify)

A simple web app where users can submit a message in the UI, and the backend securely forwards it to your Discord webhook.

## Why this setup

- The Discord webhook URL is never exposed in browser code.
- Messages are sent through a Netlify Function (`netlify/functions/send-discord.js`).
- The frontend calls a clean endpoint (`/api/send-discord`) via a Netlify redirect.
V
## 1) Create your Discord webhook

1. Open your Discord server settings.
2. Go to **Integrations** -> **Webhooks**.
3. Create a webhook and copy the webhook URL.

## 2) Configure environment variable in Netlify

In Netlify UI:

1. Open your site.
2. Go to **Site configuration** -> **Environment variables**.
3. Add:

- Key: `DISCORD_WEBHOOK_URL`
- Value: your Discord webhook URL

## 3) Local development

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:8888`

If prompted, authenticate with Netlify CLI (`netlify login`).

## 4) Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, click **Add new site** -> **Import an existing project**.
3. Pick your repo.
4. Netlify will use `netlify.toml` automatically.
5. Add `DISCORD_WEBHOOK_URL` in environment variables.
6. Deploy.

## Project structure

```text
.
├─ netlify/
│  └─ functions/
│     └─ send-discord.js
├─ public/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ .gitignore
├─ netlify.toml
├─ package.json
└─ README.md
```

## Notes

- Message limit is capped to 1900 characters to stay under Discord limits.
- Optional display name is supported and trimmed to 80 characters.
- You can customize branding in `public/styles.css`.
