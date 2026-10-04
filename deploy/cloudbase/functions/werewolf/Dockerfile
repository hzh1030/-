FROM python:3.14-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=9000
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN useradd --create-home --uid 10001 game
COPY --chown=game:game main.py server.py werewolf_engine.py network_settings.py ./
COPY --chown=game:game static ./static
USER game
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:9000/healthz', timeout=2)"
CMD ["python", "main.py"]
