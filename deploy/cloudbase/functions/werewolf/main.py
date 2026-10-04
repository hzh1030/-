"""Cloud entry point for the original game; the desktop source stays untouched."""
from __future__ import annotations

import os
import re
from pathlib import Path

from aiohttp import web
import server
from network_settings import NetworkSettings

ROOT = Path(__file__).resolve().parent
GAME_PATH = "/game"


def public_game_urls(session):
    # Keep room links on the same public website, including its game prefix.
    origin = session.server_origin.rstrip("/")
    code = session.room.code
    return {
        "origin": origin,
        "joinUrl": f"{origin}{GAME_PATH}/?join={code}",
        "qrUrl": f"{origin}{GAME_PATH}/api/rooms/{code}/qr.svg",
        "discoveryUrl": f"{origin}{GAME_PATH}/api/rooms",
        "lanHost": origin.split("://", 1)[-1],
    }


server.ensure_room_url_bundle = public_game_urls


def create_app():
    origin = os.environ.get("PUBLIC_ORIGIN", "").rstrip("/")
    if origin and not re.fullmatch(r"https?://[a-zA-Z0-9.\-\[\]:]+", origin):
        raise ValueError("PUBLIC_ORIGIN must be the website origin without a path.")
    # Public, free STUN helps peers discover their address outside a LAN.
    # Symmetric NATs can still require a TURN relay; no paid relay is enabled.
    settings = NetworkSettings(public_origin=origin, ice_servers=[
        {"urls": ["stun:stun.cloudflare.com:3478"]},
    ])
    app = web.Application(client_max_size=128 * 1024)
    app.add_subapp(GAME_PATH + "/", server.make_app(settings))

    async def redirect_game(request):
        raise web.HTTPPermanentRedirect(GAME_PATH + "/")

    async def health(request):
        # No names, session tokens, room identities or headers are disclosed.
        return web.json_response({"ok": True, "service": "werewolf"})

    app.router.add_get(GAME_PATH, redirect_game)
    app.router.add_get("/healthz", health)
    return app


if __name__ == "__main__":
    web.run_app(create_app(), host="0.0.0.0", port=int(os.environ.get("PORT", "9000")))
