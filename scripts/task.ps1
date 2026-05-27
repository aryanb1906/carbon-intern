param(
  [Parameter(Mandatory=$true, Position=0)][string]$Task
)

Write-Host "Running task: $Task"
python .\task.py $Task
