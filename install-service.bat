@echo off
echo Installing Cleansheet Development Server as Windows Service...
echo.

REM Install the service
"C:\nssm\nssm-2.24\win64\nssm.exe" install CleansheetDevServer "C:\Program Files\nodejs\node.exe" "C:\Users\PaulGaljan\AppData\Roaming\npm\node_modules\live-server\live-server.js" "C:\Users\PaulGaljan\Github\Cleansheet" "--port=8000" "--no-browser"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install service. Make sure you're running as Administrator.
    pause
    exit /b 1
)

echo.
echo Configuring service settings...

REM Set service description
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer Description "Static file server for Cleansheet at localhost:8000 with auto-reload"

REM Set display name
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer DisplayName "Cleansheet Development Server"

REM Set working directory
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer AppDirectory "C:\Users\PaulGaljan\Github\Cleansheet"

REM Set startup type to automatic
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer Start SERVICE_AUTO_START

REM Configure output logging
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer AppStdout "C:\Users\PaulGaljan\Github\Cleansheet\logs\service-output.log"
"C:\nssm\nssm-2.24\win64\nssm.exe" set CleansheetDevServer AppStderr "C:\Users\PaulGaljan\Github\Cleansheet\logs\service-error.log"

echo.
echo Starting service...
"C:\nssm\nssm-2.24\win64\nssm.exe" start CleansheetDevServer

if %errorlevel% eq 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Cleansheet Development Server is now running!
    echo.
    echo Access your site at: http://localhost:8000
    echo.
    echo Service will auto-start on Windows boot.
    echo Use 'services.msc' to manage the service.
    echo.
) else (
    echo.
    echo ERROR: Failed to start service.
)

pause
