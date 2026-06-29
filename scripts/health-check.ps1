Write-Host ""
Write-Host "======================================="
Write-Host " LEAP PROJECT HEALTH CHECK"
Write-Host "======================================="
Write-Host ""

Write-Host "Checking Empty TS/TSX Files..."

Get-ChildItem . -Recurse -Include *.ts,*.tsx |
Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.Length -eq 0
} |
Format-Table FullName

Write-Host ""

Write-Host "Checking TODO / FIXME..."

Get-ChildItem . -Recurse -Include *.ts,*.tsx |
Where-Object {
    $_.FullName -notmatch "\\node_modules\\"
} |
Select-String "TODO|FIXME"

Write-Host ""

Write-Host "Checking Duplicate Question Types..."

Get-ChildItem types -Filter *question*

Write-Host ""

Write-Host "Health Check Complete."