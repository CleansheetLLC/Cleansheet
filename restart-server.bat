@echo off
echo Restarting Cleansheet Development Server...
"C:\nssm\nssm-2.24\win64\nssm.exe" restart CleansheetDevServer

if %errorlevel% eq 0 (
    echo.
    echo Server restarted successfully!
    echo Access at: http://localhost:8000
) else (
    echo.
    echo Failed to restart server. Check if service is installed.
)

pause
