#!/usr/bin/env python3
"""Simple cross-platform task runner for common dev tasks.

Usage:
  python scripts/task.py backend-install
  python scripts/task.py backend-run
  python scripts/task.py frontend-install
  python scripts/task.py frontend-build
  python scripts/task.py docker-up
"""
import argparse
import os
import platform
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENV_DIR = os.path.join(ROOT, ".venv")


def venv_python():
    if platform.system() == "Windows":
        return os.path.join(VENV_DIR, "Scripts", "python.exe")
    return os.path.join(VENV_DIR, "bin", "python")


def run(cmd, cwd=None, check=True):
    print(f"> {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if check and result.returncode != 0:
        sys.exit(result.returncode)


def ensure_venv():
    if not os.path.exists(VENV_DIR):
        print("Creating virtualenv at .venv")
        subprocess.check_call([sys.executable, "-m", "venv", VENV_DIR])


def backend_install():
    ensure_venv()
    py = venv_python()
    run(f'"{py}" -m pip install --upgrade pip')
    run(f'"{py}" -m pip install -r backend/requirements.txt')


def backend_migrate():
    py = venv_python()
    run(f'"{py}" backend/manage.py migrate')


def backend_seed():
    py = venv_python()
    run(f'"{py}" backend/manage.py shell < backend/scripts/seed.py')


def backend_run():
    py = venv_python()
    run(f'"{py}" backend/manage.py runserver 0.0.0.0:8000')


def backend_test():
    py = venv_python()
    run(f'"{py}" backend/manage.py test')


def frontend_install():
    run('npm install', cwd=os.path.join(ROOT, 'frontend'))


def frontend_run():
    run('npm run dev', cwd=os.path.join(ROOT, 'frontend'))


def frontend_build():
    run('npm ci', cwd=os.path.join(ROOT, 'frontend'))
    run('npm run lint', cwd=os.path.join(ROOT, 'frontend'))
    run('npm run typecheck', cwd=os.path.join(ROOT, 'frontend'))
    run('npm run build', cwd=os.path.join(ROOT, 'frontend'))


def docker_up():
    run('docker compose up --build')


def docker_down():
    run('docker compose down -v')


TASKS = {
    'backend-install': backend_install,
    'backend-migrate': backend_migrate,
    'backend-seed': backend_seed,
    'backend-run': backend_run,
    'backend-test': backend_test,
    'frontend-install': frontend_install,
    'frontend-run': frontend_run,
    'frontend-build': frontend_build,
    'docker-up': docker_up,
    'docker-down': docker_down,
}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('task', choices=TASKS.keys())
    args = p.parse_args()
    TASKS[args.task]()


if __name__ == '__main__':
    main()
