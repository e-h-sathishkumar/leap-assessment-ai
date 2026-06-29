Write-Host ""
Write-Host "LEAP PROJECT STATISTICS"
Write-Host ""

$ts = (Get-ChildItem . -Recurse -Include *.ts | Measure-Object).Count
$tsx = (Get-ChildItem . -Recurse -Include *.tsx | Measure-Object).Count

$components = (Get-ChildItem components -Recurse -Include *.tsx | Measure-Object).Count

$services = (Get-ChildItem services -Recurse -Include *.ts | Measure-Object).Count

Write-Host "TS Files       :" $ts
Write-Host "TSX Files      :" $tsx
Write-Host "Components     :" $components
Write-Host "Services       :" $services