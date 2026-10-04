"""Explicit local deployment settings; never accept proxy headers as configuration."""
from __future__ import annotations

import copy
import ipaddress
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urlsplit


@dataclass
class NetworkSettings:
    public_origin: str = ""
    listen_host: str = "0.0.0.0"
    listen_port: int = 0
    ice_servers: list[dict] = field(default_factory=list)
    ice_transport_policy: str = "all"

    def rtc_configuration(self) -> dict:
        return {"iceServers": copy.deepcopy(self.ice_servers), "iceTransportPolicy": self.ice_transport_policy}


def parse_network_settings(data: dict) -> NetworkSettings:
    if not isinstance(data, dict) or set(data) - set(NetworkSettings.__dataclass_fields__):
        raise ValueError("网络配置必须是对象，且不能包含未知配置项。")
    settings = NetworkSettings(**data)
    origin = settings.public_origin
    if not isinstance(origin, str):
        raise ValueError("public_origin 必须是 HTTPS 地址字符串。")
    if origin:
        parsed = urlsplit(origin)
        if (parsed.scheme != "https" or not parsed.hostname or parsed.username is not None
                or parsed.password is not None or parsed.path not in {"", "/"}
                or parsed.query or parsed.fragment or any(c.isspace() for c in origin)
                or "\\" in origin or any(ord(c) < 32 for c in origin)):
            raise ValueError("public_origin 必须是完整 HTTPS 站点根地址，不得包含账号、路径、参数或片段。")
        try:
            port = parsed.port
        except ValueError:
            raise ValueError("HTTPS 地址的端口无效。") from None
        if port == 0:
            raise ValueError("HTTPS 地址的端口不能是 0。")
        settings.public_origin = origin.rstrip("/")
    try:
        ipaddress.ip_address(settings.listen_host)
    except (ValueError, TypeError):
        raise ValueError("listen_host 必须是本机监听 IP 地址。") from None
    if type(settings.listen_port) is not int or not 0 <= settings.listen_port <= 65535:
        raise ValueError("listen_port 必须是 0 至 65535 的整数。")
    if origin and settings.listen_port == 0:
        raise ValueError("配置 HTTPS 入口时须设置固定 listen_port，供 HTTPS 代理转发。")
    if settings.ice_transport_policy not in {"all", "relay"}:
        raise ValueError("ice_transport_policy 只能是 all 或 relay。")
    if not isinstance(settings.ice_servers, list) or len(settings.ice_servers) > 8:
        raise ValueError("ice_servers 必须是数组，最多 8 项。")
    has_turn = False
    for entry in settings.ice_servers:
        if not isinstance(entry, dict) or set(entry) - {"urls", "username", "credential"}:
            raise ValueError("ICE 配置只接受 urls、username、credential。")
        urls = entry.get("urls")
        urls = [urls] if isinstance(urls, str) else urls
        if not isinstance(urls, list) or not 1 <= len(urls) <= 8:
            raise ValueError("每个 ICE 项需要 1 至 8 个服务器地址。")
        for url in urls:
            if not isinstance(url, str) or not re.fullmatch(
                r"(?:stun|stuns|turn|turns):(?:[A-Za-z0-9.-]+|\[[0-9A-Fa-f:]+\])(?::[0-9]{1,5})?(?:\?transport=(?:udp|tcp))?", url
            ):
                raise ValueError("ICE 地址必须是有效的 stun/stuns/turn/turns 地址。")
            if url.startswith(("turn:", "turns:")):
                has_turn = True
                if not all(isinstance(entry.get(key), str) and entry[key].strip() for key in ("username", "credential")):
                    raise ValueError("TURN 中继需要 username 和 credential。")
        for key in ("username", "credential"):
            if key in entry and (not isinstance(entry[key], str) or len(entry[key]) > 2048):
                raise ValueError("ICE 凭据格式无效。")
    if settings.ice_transport_policy == "relay" and not has_turn:
        raise ValueError("relay 模式至少需要一个有凭据的 TURN 中继。")
    return settings


def load_network_settings(path: Path | None = None) -> NetworkSettings:
    if path is None:
        directory = Path(sys.executable).resolve().parent if getattr(sys, "frozen", False) else Path(__file__).resolve().parent
        path = directory / "network-settings.json"
    if not path.exists():
        return NetworkSettings()
    try:
        return parse_network_settings(json.loads(path.read_text(encoding="utf-8-sig")))
    except (OSError, ValueError, TypeError) as exc:
        # Do not echo JSON contents: they can contain TURN credentials.
        raise ValueError("network-settings.json 无效，请检查配置项和格式。") from exc
