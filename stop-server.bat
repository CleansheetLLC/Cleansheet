@echo off
echo Stopping Cleansheet Development Server...
"C:\nssm\nssm-2.24\win64\nssm.exe" stop CleansheetDevServer

if %errorlevel% eq 0 (
    echo.
    echo Server stopped successfully!
) else (
    echo.
    echo Failed to stop server. It may not be running.
)

pause
