@echo off
setlocal
cd /d "%~dp0"
set PORT=%~1
if "%PORT%"=="" set PORT=3001
set REQUESTED_PORT=%PORT%
echo Cleaning old Mookgroup Node.js processes...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root = [regex]::Escape((Resolve-Path '.').Path); Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match $root } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
if exist ".next" (
  echo Clearing previous production build...
  rmdir /s /q ".next"
)
for /f %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$port = [int]$env:REQUESTED_PORT; while (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { $port++ }; Write-Output $port"') do set PORT=%%P
if not "%PORT%"=="%REQUESTED_PORT%" (
  echo Port %REQUESTED_PORT% was busy. Building and starting production server on http://localhost:%PORT%
) else (
  echo Building and starting production server on http://localhost:%PORT%
)
call npm.cmd run build || exit /b 1
call npm.cmd run start -- --port %PORT%
