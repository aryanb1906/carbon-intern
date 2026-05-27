Write-Host "Starting docker compose"
. .\activate-venv.ps1
python .\task.py docker-up
