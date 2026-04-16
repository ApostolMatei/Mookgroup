@echo off
setlocal
cd /d "%~dp0"
set PORT=%~1
if "%PORT%"=="" set PORT=3001
set REQUESTED_PORT=%PORT%
echo Cleaning old Mookgroup Node.js processes...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root = [regex]::Escape((Resolve-Path '.').Path); Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match $root } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
if exist ".next-dev" (
  echo Clearing previous dev cache...
  rmdir /s /q ".next-dev"
)
for /f %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$port = [int]$env:REQUESTED_PORT; while (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { $port++ }; Write-Output $port"') do set PORT=%%P
if not "%PORT%"=="%REQUESTED_PORT%" (
  echo Port %REQUESTED_PORT% was busy. Starting dev server on http://localhost:%PORT%
) else (
  echo Starting dev server on http://localhost:%PORT%
)
call npm.cmd run dev -- --port %PORT%
