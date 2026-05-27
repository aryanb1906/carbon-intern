Write-Host "Building frontend (install, lint, typecheck, build)"
. .\activate-venv.ps1
python .\task.py frontend-build
