@echo off
echo Uninstalling Cleansheet Development Server...
echo.
echo This will:
echo - Stop the service if running
echo - Remove the Windows service
echo.
echo Press Ctrl+C to cancel, or
pause

REM Stop the service first
"C:\nssm\nssm-2.24\win64\nssm.exe" stop CleansheetDevServer

REM Remove the service
"C:\nssm\nssm-2.24\win64\nssm.exe" remove CleansheetDevServer confirm

if %errorlevel% eq 0 (
    echo.
    echo ========================================
    echo Service uninstalled successfully!
    echo ========================================
    echo.
    echo The service has been removed from Windows.
    echo You can reinstall it anytime by running install-service.bat
    echo.
) else (
    echo.
    echo ERROR: Failed to uninstall service.
    echo Make sure you're running as Administrator.
)

pause
