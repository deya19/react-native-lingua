"""
Buolingo AI Language Teacher Agent
================================
A voice-only AI teacher powered by OpenAI Realtime and Stream Edge.
Always speaks English and teaches the selected language through English.

Usage:
    python agent.py run --call-id lesson-en-greetings-1 --language Spanish
    python agent.py serve --host 0.0.0.0 --port 8000
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Load parent .env so STREAM_API_KEY, STREAM_API_SECRET, and OPENAI_API_KEY are available
_parent_env = Path(__file__).resolve().parent.parent / ".env"
if _parent_env.exists():
    load_dotenv(_parent_env)
load_dotenv()


# ---------------------------------------------------------------------------
# Agent configuration
# ---------------------------------------------------------------------------

TEACHER_INSTRUCTIONS = """You are Buolingo, an AI language teacher.

RULES:
- ALWAYS speak in English. Do not switch languages.
- You teach the user a new language by explaining words, phrases, and grammar concepts through English.
- Be patient, encouraging, and friendly.
- When the user makes a mistake, gently correct them and encourage them to try again.
- Celebrate the user's progress.
- Keep explanations clear and concise.
- Ask the user to repeat phrases after you to practice pronunciation.

TARGET LANGUAGE: {target_language}

LESSON CONTEXT:
This is a language lesson. Guide the user through basic greetings, vocabulary, and simple conversation patterns. Adapt your teaching to the user's responses."""


# ---------------------------------------------------------------------------
# Agent factory
# ---------------------------------------------------------------------------

def create_teacher_agent(target_language: str = "Spanish") -> "Agent":
    """Create and configure the Buolingo AI Teacher agent."""

    try:
        from vision_agents.core import Agent, User
        from vision_agents.plugins.openai import Realtime
        from vision_agents.plugins.getstream import Edge
    except ImportError as exc:
        print("Error: vision-agents package is not installed.")
        print("Install it with:  pip install 'vision-agents[getstream,openai]' python-dotenv")
        raise SystemExit(1) from exc

    # Verify required env vars
    required = ["STREAM_API_KEY", "STREAM_API_SECRET", "OPENAI_API_KEY"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(f"Error: missing environment variables: {', '.join(missing)}")
        raise SystemExit(1)

    instructions = TEACHER_INSTRUCTIONS.format(target_language=target_language)

    agent = Agent(
        edge=Edge(),
        llm=Realtime(),
        agent_user=User(id="buolingo-teacher", name="AI Teacher"),
        instructions=instructions,
    )

    return agent


# ---------------------------------------------------------------------------
# Run modes
# ---------------------------------------------------------------------------

async def _run_agent_session(call_id: str, call_type: str, target_language: str) -> None:
    """Async helper to run a single agent session."""
    agent = create_teacher_agent(target_language)
    print(f"Joining call: type={call_type}, id={call_id}, language={target_language}")
    call = await agent.create_call(call_type, call_id)
    async with agent.join(call):
        await agent.finish()


def run_console(call_id: str, call_type: str, target_language: str) -> None:
    """Join a specific call and run the agent in console mode."""
    asyncio.run(_run_agent_session(call_id, call_type, target_language))


def run_server(host: str, port: int, target_language: str) -> None:
    """Start a FastAPI HTTP server that spawns agents on demand."""

    try:
        from fastapi import FastAPI
        from pydantic import BaseModel
        import uvicorn
    except ImportError as exc:
        print("Error: fastapi/uvicorn is not installed.")
        print("Install it with:  pip install fastapi uvicorn")
        raise SystemExit(1) from exc

    app = FastAPI(title="Buolingo Agent Server")

    active_sessions: dict[str, asyncio.Task] = {}

    class StartSessionRequest(BaseModel):
        call_id: str
        call_type: str = "default"

    class StartSessionResponse(BaseModel):
        session_id: str
        status: str

    @app.post("/sessions", response_model=StartSessionResponse)
    async def start_session(body: StartSessionRequest):
        print(f"[SESSION START] call_id={body.call_id}, call_type={body.call_type}")
        session_id = f"session-{body.call_id}-{asyncio.get_event_loop().time()}"

        async def _session():
            try:
                print(f"[SESSION] Creating agent for {body.call_id}...")
                agent = create_teacher_agent(target_language)
                call = await agent.create_call(body.call_type, body.call_id)
                async with agent.join(call):
                    print(f"[SESSION] Agent joined call {body.call_id}")
                    await agent.finish()
                    print(f"[SESSION] Agent finished")
            except Exception as e:
                print(f"[SESSION] Error: {e}")
            finally:
                active_sessions.pop(session_id, None)

        task = asyncio.create_task(_session())
        active_sessions[session_id] = task
        return StartSessionResponse(session_id=session_id, status="started")

    @app.delete("/sessions/{session_id}")
    async def stop_session(session_id: str):
        print(f"[SESSION STOP] {session_id}")
        task = active_sessions.pop(session_id, None)
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
            return {"status": "stopped"}
        return {"status": "not_found"}

    @app.get("/health")
    async def health():
        return {"status": "ok", "sessions": len(active_sessions)}

    print(f"Starting Buolingo agent server on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        prog="agent.py",
        description="Buolingo AI Language Teacher – voice-only agent using OpenAI Realtime + Stream Edge",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # --- run ---
    run_parser = subparsers.add_parser("run", help="Console mode: join one call")
    run_parser.add_argument("--call-id", default="buolingo-lesson-1", help="Stream call ID to join")
    run_parser.add_argument("--call-type", default="default", help="Stream call type (default)")
    run_parser.add_argument("--language", default="Spanish", help="Target language to teach")

    # --- serve ---
    serve_parser = subparsers.add_parser("serve", help="HTTP server mode")
    serve_parser.add_argument("--host", default="0.0.0.0", help="Bind host")
    serve_parser.add_argument("--port", type=int, default=8000, help="Bind port")
    serve_parser.add_argument("--language", default="Spanish", help="Target language to teach")

    args = parser.parse_args(argv)

    if args.command == "run":
        run_console(
            call_id=args.call_id,
            call_type=args.call_type,
            target_language=args.language,
        )
    elif args.command == "serve":
        run_server(
            host=args.host,
            port=args.port,
            target_language=args.language,
        )


if __name__ == "__main__":
    main()
