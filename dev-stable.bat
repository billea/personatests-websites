@echo off
echo ========================================
echo    Korean MBTI Platform - Stable Dev    
echo ========================================
echo.

:: Kill any existing Node processes
echo [1/6] Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
timeout /t 2 >nul

:: Clean Next.js cache aggressively
echo [2/6] Cleaning Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .next mkdir .next

:: Clear npm cache
echo [3/6] Clearing npm cache...
npm cache clean --force >nul 2>&1

:: Set Windows-friendly environment
echo [4/6] Setting Windows environment...
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_ENV=development
set FORCE_COLOR=0
set CI=false

:: Create necessary directories
echo [5/6] Preparing directories...
if not exist .next\cache mkdir .next\cache
if not exist .next\server mkdir .next\server
if not exist .next\static mkdir .next\static

:: Start development server with recovery
echo [6/6] Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop
echo.

:start_server
npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Server crashed! Attempting recovery...
    echo.
    
    :: Clean and retry
    if exist .next rmdir /s /q .next
    timeout /t 3 >nul
    
    echo [RECOVERY] Restarting server...
    goto start_server
)

echo Server stopped normally.
pause