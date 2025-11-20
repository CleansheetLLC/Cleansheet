@echo off
echo Starting Cleansheet Development Server...
"C:\nssm\nssm-2.24\win64\nssm.exe" start CleansheetDevServer

if %errorlevel% eq 0 (
    echo.
    echo Server started successfully!
    echo Access at: http://localhost:8000
) else (
    echo.
    echo Failed to start server. Check if service is installed.
    echo Run install-service.bat as Administrator first.
)

pause
