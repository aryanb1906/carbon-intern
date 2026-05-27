Scripts helper
===============

This folder contains a cross-platform Python task runner for common developer tasks.

Run examples:

```bash
# Install backend deps into a .venv
python scripts/task.py backend-install

# Start backend dev server
python scripts/task.py backend-run

# Install frontend deps and build
python scripts/task.py frontend-build

# Start everything with Docker
python scripts/task.py docker-up
```

The script is intentionally small and avoids shell-specific activation steps; it works on Windows, macOS and Linux.
