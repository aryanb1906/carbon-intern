param()

$venv = Join-Path -Path (Resolve-Path ..).Path -ChildPath ".venv\Scripts\Activate.ps1"
if (Test-Path $venv) {
    Write-Host "Activating virtualenv from $venv"
    . $venv
} else {
    Write-Host "Virtualenv not found, creating .venv..."
    python -m venv ..\.venv
    Write-Host "Activating new virtualenv"
    . $venv
}
