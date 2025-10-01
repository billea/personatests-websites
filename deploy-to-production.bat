@echo off
REM PersonaTests Production Deployment Script
REM This script builds and deploys korean-mbti-platform to personatests-websites

echo 🚀 Starting PersonaTests Production Deployment...

REM Step 1: Build the latest version
echo 📦 Building latest version...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Aborting deployment.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Step 2: Backup current production
echo 💾 Creating backup of current production...
cd personatests-websites
set BACKUP_DIR=backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
mkdir "%BACKUP_DIR%" 2>nul
copy *.html "%BACKUP_DIR%\" >nul 2>&1
copy *.js "%BACKUP_DIR%\" >nul 2>&1
copy *.css "%BACKUP_DIR%\" >nul 2>&1
xcopy _next "%BACKUP_DIR%\_next\" /E /I /Q >nul 2>&1

REM Step 3: Clear production (except config files)
echo 🧹 Clearing production files...
for %%f in (*.html) do if not "%%f"=="netlify.toml" del "%%f"
for %%f in (*.css) do del "%%f"
for %%f in (*.js) do del "%%f"
rmdir /S /Q _next 2>nul

REM Step 4: Copy new build
echo 📁 Copying new build to production...
cd ..
xcopy out\* personatests-websites\ /E /I /Q /Y

REM Step 5: Git commit and deploy
echo 📤 Deploying to production...
cd personatests-websites
git add -A
git commit -m "Production deployment %date% %time%"

git push

echo 🎉 Deployment completed! Check https://personatests.com in 1-2 minutes.
echo 💾 Backup created in: %BACKUP_DIR%
pause