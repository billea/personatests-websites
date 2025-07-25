@echo off
echo ========================================
echo   VIBECHECK DEPLOYMENT PREPARATION
echo ========================================
echo.

REM Create deployment folder on Desktop
set DEPLOY_FOLDER=%USERPROFILE%\Desktop\vibecheck-deploy
echo Creating deployment folder: %DEPLOY_FOLDER%
if exist "%DEPLOY_FOLDER%" rmdir /s /q "%DEPLOY_FOLDER%"
mkdir "%DEPLOY_FOLDER%"

REM Copy essential files
echo.
echo Copying files for deployment...
copy "index.html" "%DEPLOY_FOLDER%\"
copy "script.js" "%DEPLOY_FOLDER%\"
copy "styles.css" "%DEPLOY_FOLDER%\"
copy "privacy.html" "%DEPLOY_FOLDER%\"
copy "terms.html" "%DEPLOY_FOLDER%\"
copy "_redirects" "%DEPLOY_FOLDER%\"

echo.
echo ========================================
echo   DEPLOYMENT READY! 
echo ========================================
echo.
echo Your files are ready in: %DEPLOY_FOLDER%
echo.
echo NEXT STEPS:
echo 1. Go to: https://app.netlify.com/drop
echo 2. Drag the entire 'vibecheck-deploy' folder onto the page
echo 3. Wait for deployment (30-60 seconds)
echo 4. Get your live URL!
echo.
echo Your website will be live and ready for AdSense!
echo.
pause

REM Open the deployment folder
start "" "%DEPLOY_FOLDER%"