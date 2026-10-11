# 🤖 Widget AI

![Render Deployment](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-Personal_Use-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Python_%7C_Flask_%7C_JS-orange?style=for-the-badge)

A high-performance, optimized AI assistant featuring a dynamic glass-morphic interface, sub-second Groq inference, session history management, and custom theme switching.

🌐 **Live Demo:** [widget-ai.duckdns.org](https://widget-ai.duckdns.org)

---

## ✨ Features

- **Dynamic Landing State:** Clean central launch view with randomized quick-start prompt chips that smoothly transition into a chat session.
- **High-Speed Inference:** Open-weights models on Groq LPUs for instant token streaming.
- **Adaptive UI/UX:** Fully responsive layout optimized for mobile keyboards and desktop viewports with seamless hover-triggered history sidebar.
- **Customizable Settings:** Modal toggle for typing stream animation and chat history clearing.
- **Theme Customization:** Native light and dark mode with minimalist vector icons.

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask
- **LLM Provider:** Groq Cloud API
- **Frontend:** Vanilla JavaScript, HTML5, CSS3, Marked.js
- **Hosting & DNS:** Render Hosting with custom DuckDNS resolution

---

## 📁 Repository Structure

```text
WidgetAI/
├── app.py              # Flask server and Groq API proxy
├── requirements.txt    # Python dependencies
├── .env                # Environment keys (Git ignored)
└── templates/
    └── index.html      # Complete single-file frontend
