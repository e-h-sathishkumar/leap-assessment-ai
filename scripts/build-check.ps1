Write-Host ""
Write-Host "==============================="
Write-Host " LEAP BUILD CHECK"
Write-Host "==============================="
Write-Host ""

Write-Host "Running ESLint..."
npm run lint

Write-Host ""
Write-Host "Running Next.js Build..."
npm run build

Write-Host ""
Write-Host "Build Check Completed."