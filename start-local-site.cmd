@echo off
setlocal

cd /d "%~dp0"

start "Aquatic Treasures of Fort Myers Dev" cmd /k "cd /d %~dp0 && npm run dev -- --force"
timeout /t 8 /nobreak >nul
start "" http://localhost:4321/
