@echo off
title Whats Massage Local Server
cd /d "%~dp0"

echo ==========================================
echo Starting Whats Massage Local Web Server...
echo ==========================================

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [FOUND] Python is installed.
    echo Starting server at http://localhost:8000 ...
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

:: Check if Node.js/npx is installed
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [FOUND] Node.js/npx is installed.
    echo Starting server at http://localhost:8000 ...
    start http://localhost:8000
    npx http-server -p 8000
    goto end
)

echo.
echo [WARNING] Neither Python nor Node.js (npx) was found on your system.
echo WebRTC dan akses mikrofon/kamera diblokir oleh browser jika dibuka sebagai file:/// langsung.
echo Silakan install Python atau Node.js untuk dapat menjalankan server lokal ini secara otomatis.
echo.
pause

:end
