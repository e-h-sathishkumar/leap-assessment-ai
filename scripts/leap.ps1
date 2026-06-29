param(
    [string]$Command = ""
)

switch ($Command.ToLower()) {

    "health" {

        Write-Host ""
        Write-Host "===== LEAP HEALTH CHECK ====="
        Write-Host ""

        Get-ChildItem . -Recurse -Include *.ts,*.tsx |
        Where-Object {
            $_.FullName -notmatch "\\node_modules\\" -and
            $_.Length -eq 0
        } |
        Select-Object FullName

        Write-Host ""
        Write-Host "Health Check Complete."
    }

    "stats" {

        Write-Host ""
        Write-Host "===== LEAP PROJECT STATS ====="
        Write-Host ""

        $ts = (Get-ChildItem . -Recurse -Include *.ts | Where-Object {$_.FullName -notmatch "\\node_modules\\"} | Measure-Object).Count
        $tsx = (Get-ChildItem . -Recurse -Include *.tsx | Where-Object {$_.FullName -notmatch "\\node_modules\\"} | Measure-Object).Count
        $components = (Get-ChildItem components -Recurse -Include *.tsx | Measure-Object).Count
        $services = (Get-ChildItem services -Recurse -Include *.ts | Measure-Object).Count

        Write-Host "TS Files      : $ts"
        Write-Host "TSX Files     : $tsx"
        Write-Host "Components    : $components"
        Write-Host "Services      : $services"
    }

    "build" {

        Write-Host ""
        Write-Host "===== BUILD ====="
        Write-Host ""

        npm run lint

        if ($LASTEXITCODE -eq 0) {
            npm run build
        }
    }

    "clean" {

        Write-Host ""
        Write-Host "===== CLEAN ====="

        if (Test-Path ".next") {
            Remove-Item ".next" -Recurse -Force
            Write-Host ".next deleted"
        }

        if (Test-Path ".turbo") {
            Remove-Item ".turbo" -Recurse -Force
            Write-Host ".turbo deleted"
        }

        Write-Host "Clean Complete."
    }

    "doctor" {

        Write-Host ""
        Write-Host "===== LEAP DOCTOR ====="

        Write-Host ""
        node --version
        npm --version

        Write-Host ""

        if (Test-Path ".env.local") {
            Write-Host ".env.local found"
        }
        else {
            Write-Host ".env.local NOT found"
        }
    }

    default {

        Write-Host ""
        Write-Host "Usage:"
        Write-Host ""
        Write-Host ".\scripts\leap.ps1 health"
        Write-Host ".\scripts\leap.ps1 stats"
        Write-Host ".\scripts\leap.ps1 build"
        Write-Host ".\scripts\leap.ps1 clean"
        Write-Host ".\scripts\leap.ps1 doctor"
    }
}