# Lingua AI Language Teacher Agent

A voice-only AI language teacher built with **Vision Agents**, powered by **OpenAI Realtime** (speech-to-speech) and **Stream Edge** (real-time transport).

The teacher always speaks **English** and teaches the selected language to the user through English explanations.

---

## Prerequisites

- Python 3.11+
- API keys:
  - `STREAM_API_KEY` & `STREAM_API_SECRET` (from your Stream Video dashboard)
  - `OPENAI_API_KEY` (from OpenAI)

These keys are **already set** in the parent repo's `.env` file. The agent auto-loads them from `../.env`.

---

## Installation

```bash
cd vision-agent
pip install -r requirements.txt
```

Or with `uv`:

```bash
uv pip install -r requirements.txt
```

---

## Usage

### Console mode (single call)

Join a specific Stream call and start teaching:

```bash
python agent.py run --call-id lesson-en-greetings-1 --language Spanish
```

Arguments:
- `--call-id` — the Stream call ID to join (matches the format created by the mobile app: `lesson-{languageCode}-{lessonId}`)
- `--call-type` — Stream call type, default is `default`
- `--language` — the target language the teacher will teach, default is `Spanish`

### HTTP server mode (production)

Spawn agents on demand via HTTP:

```bash
python agent.py serve --host 0.0.0.0 --port 8000 --language Spanish
```

Endpoints:
- `POST /calls/{call_id}/sessions` — start an agent session
- `DELETE /calls/{call_id}/sessions/{session_id}` — close a session
- `GET /calls/{call_id}/sessions/{session_id}/metrics` — real-time metrics
- `GET /health` — liveness check
- `GET /ready` — readiness check

---

## How it works

1. The mobile app creates a Stream video call via `/api/stream-token`.
2. The user joins the call from the lesson screen.
3. This agent joins the **same** call as a participant.
4. The agent uses OpenAI Realtime API for low-latency speech-to-speech conversation.
5. The agent acts as a patient, encouraging language teacher — always in English.

---

## Architecture

```
Mobile App  ──►  Stream Cloud  ◄──  AI Teacher Agent
   │                  │
   └─ joins call ─────┘
   
Agent stack:
  Edge:    stream.Edge()       → Stream Video transport
  LLM:     openai.Realtime()   → OpenAI Realtime (voice in, voice out)
  Role:    language teacher    → English explanations + target-language practice
```

---

## Troubleshooting

- **SSL errors during pip install** — this is an environment-specific certificate issue. Try `pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt` or use a different network.
- **"vision-agents package is not installed"** — run `pip install -r requirements.txt` first.
- **Missing env vars** — ensure `STREAM_API_KEY`, `STREAM_API_SECRET`, and `OPENAI_API_KEY` are set in `../.env` or a local `.env` in this folder.
