import os
import sys
from flask import Flask, render_template, request, jsonify, send_from_directory
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

MAX_HISTORY = 20  # last N messages sent to the model

SYSTEM_PROMPT = """
You are Widget AI, a concise and sharp technical assistant.

Rules:
1. Give direct answers immediately in sentence 1. Never use greetings, filler, or intro setups (e.g., avoid "Hello", "Sure!", "Here is...").
2. Keep explanations high density and under 150 words.
3. Use bullet points for itemized details.
4. Format all code snippets in proper markdown code blocks with language names.
5. No concluding summaries or repetitive wrap-ups at the end.
"""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/manifest.webmanifest")
def manifest():
    return send_from_directory(app.static_folder, "manifest.webmanifest",
                               mimetype="application/manifest+json")

@app.route("/sw.js")
def service_worker():
    # served from the root so the worker can control the whole site
    resp = send_from_directory(app.static_folder, "sw.js", mimetype="application/javascript")
    resp.headers["Cache-Control"] = "no-cache"
    return resp

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        history = data.get("messages", [])

        if not isinstance(history, list) or not history:
            return jsonify({"error": "Message cannot be empty."}), 400

        clean = [
            {"role": m["role"], "content": str(m["content"])}
            for m in history
            if isinstance(m, dict)
            and m.get("role") in ("user", "assistant")
            and m.get("content")
        ][-MAX_HISTORY:]

        if not clean:
            return jsonify({"error": "Message cannot be empty."}), 400

        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + clean,
            temperature=0.3,
            max_tokens=350
        )

        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Groq API Error: {str(e)}", file=sys.stderr)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
