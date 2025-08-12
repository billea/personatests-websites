@echo off
echo ========================================
echo    ULTRA STABLE Korean MBTI Platform    
echo ========================================
echo.

:: Enhanced process cleanup
echo [1/7] Enhanced process cleanup...
tasklist | find "node.exe" >nul && taskkill /F /IM node.exe >nul 2>&1
tasklist | find "npm.exe" >nul && taskkill /F /IM npm.exe >nul 2>&1
timeout /t 3 >nul

:: Aggressive cache cleanup using Node.js script
echo [2/7] Running aggressive cache cleanup...
node cache-cleanup.js

:: Clear all possible caches
echo [3/7] Clearing additional caches...
if exist "%TEMP%\next-*" rmdir /s /q "%TEMP%\next-*" >nul 2>&1
npm cache clean --force >nul 2>&1

:: Set optimal Windows environment
echo [4/7] Setting optimal Windows environment...
set NODE_OPTIONS=--max-old-space-size=8192 --no-experimental-fetch
set NODE_ENV=development
set FORCE_COLOR=0
set CI=false
set NEXT_CACHE_DISABLED=1

:: Create clean directories with proper permissions
echo [5/7] Preparing clean directories...
mkdir .next 2>nul
mkdir .next\cache 2>nul
mkdir .next\server 2>nul
mkdir .next\static 2>nul

:: Pre-start validation
echo [6/7] Validating setup...
if not exist package.json (
    echo ERROR: package.json not found!
    pause
    exit /b 1
)

:: Start with automatic recovery
echo [7/7] Starting ultra-stable development server...
echo.
echo Server will be available at: http://localhost:3000 (or next available port)
echo.
echo Features enabled:
echo - Automatic cache cleanup
echo - Process management  
echo - Error recovery
echo - Windows optimizations
echo.
echo Press Ctrl+C to stop
echo.

:start_server
npm run dev
set EXIT_CODE=%ERRORLEVEL%

if %EXIT_CODE% NEQ 0 (
    echo.
    echo [ERROR] Server crashed with exit code %EXIT_CODE%!
    echo [RECOVERY] Running emergency cleanup...
    
    :: Emergency cleanup
    node cache-cleanup.js
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 5 >nul
    
    echo [RECOVERY] Restarting in 3 seconds...
    timeout /t 3 >nul
    goto start_server
)

echo.
echo Server stopped normally.
pause