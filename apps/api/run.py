import os
import sys
import uvicorn

port = int(os.environ.get("PORT", 8000))

print(f"[run.py] PORT env = {os.environ.get('PORT', 'NOT SET')}", flush=True)
print(f"[run.py] Starting uvicorn on 0.0.0.0:{port}", flush=True)
print(f"[run.py] Python {sys.version}", flush=True)

uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
