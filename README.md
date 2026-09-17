# Widget AI

A high-performance, optimized AI assistant featuring a dynamic glass-morphic interface, sub-second Groq inference, session history management, and custom theme switching.

**Live Demo:** https://widget-ai.duckdns.org

---

## Features

- **Dynamic Landing State**: Clean central launch view with randomized quick-start prompt chips that smoothly transition into a chat session
- **High-Speed Inference**: Open-weights models on Groq LPUs for instant token streaming
- **Adaptive UI/UX**: Fully responsive layout optimized for mobile keyboards and desktop viewports with seamless hover-triggered history sidebar
- **Customizable Settings**: Modal toggle for typing stream animation and chat history clearing
- **Theme Customization**: Native light and dark mode with minimalist vector icons

---

## Tech Stack

| Component | Technology |
| --- | --- |
| Backend | Python, Flask |
| LLM Provider | Groq Cloud API |
| Frontend | Vanilla JavaScript, HTML5, CSS3, Marked.js |
| Hosting | Render |
| DNS Routing | DuckDNS |

---

## Project Structure

```
├── app.py              # Flask server and Groq API proxy
├── requirements.txt    # Python dependencies
├── .env                # Environment keys (Git ignored)
└── templates/
    └── index.html      # Complete single-file frontend
```

---

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/widget-ai.git
cd widget-ai
```

2. Set up a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

5. Run the application:
```bash
python app.py
```

Open `http://localhost:5000` in your browser.

---

## Deployment

### Render Configuration

1. Connect your GitHub repository as a New Web Service on Render
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `python app.py`
4. Add environment variable under Environment settings:
   - `GROQ_API_KEY`: Your Groq API key

### Custom Domain (DuckDNS)

1. Register a subdomain at [DuckDNS](https://www.duckdns.org/)
2. Map it to your Render deployment IP
3. Add your custom domain under Settings > Custom Domains in Render dashboard

---

## License

This project is for educational and personal purposes.
