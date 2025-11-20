@echo off
echo ========================================
echo Cleansheet Development Server Status
echo ========================================
echo.

"C:\nssm\nssm-2.24\win64\nssm.exe" status CleansheetDevServer

if %errorlevel% eq 0 (
    echo.
    echo Server is RUNNING
    echo.
    echo Access at: http://localhost:8000
    echo.
    echo Recent output log (last 20 lines):
    echo ----------------------------------------
    if exist "C:\Users\PaulGaljan\Github\Cleansheet\logs\service-output.log" (
        powershell -Command "Get-Content 'C:\Users\PaulGaljan\Github\Cleansheet\logs\service-output.log' -Tail 20"
    ) else (
        echo No log file found yet.
    )
    echo ----------------------------------------
) else (
    echo.
    echo Server is NOT RUNNING
    echo.
    echo Run start-server.bat to start it.
)

echo.
echo Management Commands:
echo - start-server.bat     : Start the server
echo - stop-server.bat      : Stop the server
echo - restart-server.bat   : Restart the server
echo - check-server-status.bat : View this status
echo.

pause
