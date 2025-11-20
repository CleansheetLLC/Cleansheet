# Cleansheet Development Server Setup

## Overview

The Cleansheet website is configured to run as a Windows service, making it continuously available at **http://localhost:8000** with automatic file change detection and browser reload.

## Technology Stack

- **live-server**: Node.js development server with auto-reload capabilities
- **NSSM**: Windows service manager (Non-Sucking Service Manager)
- **Port**: 8000
- **Directory**: C:\Users\PaulGaljan\Github\Cleansheet

## Features

✅ Auto-starts on Windows boot
✅ Auto-reload when HTML/CSS/JS files change
✅ CORS enabled for API testing
✅ Request logging to files
✅ Easy management via batch scripts

## Installation

### 1. Install the Service (First Time Only)

**Right-click** `install-service.bat` and select **"Run as Administrator"**

This will:
- Install the Windows service "CleansheetDevServer"
- Configure auto-start on boot
- Set up logging to `logs/` directory
- Start the server

### 2. Verify Installation

Open your browser and navigate to:
```
http://localhost:8000
```

You should see the Cleansheet website.

## Management Commands

All commands are available as batch files in this directory:

| Script | Purpose | Admin Required |
|--------|---------|----------------|
| `start-server.bat` | Start the server | No |
| `stop-server.bat` | Stop the server | No |
| `restart-server.bat` | Restart the server | No |
| `check-server-status.bat` | View status and recent logs | No |
| `uninstall-service.bat` | Remove the service | Yes |

### Quick Start/Stop

Just double-click the appropriate `.bat` file:
- `start-server.bat` - Starts the server
- `stop-server.bat` - Stops the server
- `restart-server.bat` - Restarts (useful after making changes)

### Check Status

Run `check-server-status.bat` to see:
- Whether the server is running
- Recent log entries
- Quick access URL

## Auto-Reload Feature

The server automatically detects changes to:
- HTML files (`.html`)
- CSS files (`.css`)
- JavaScript files (`.js`)

When you save changes to any of these files, **your browser will automatically refresh** to show the updates. No manual refresh needed!

## Logs

Server logs are stored in:
```
C:\Users\PaulGaljan\Github\Cleansheet\logs\
├── service-output.log  (Normal output and requests)
└── service-error.log   (Errors and warnings)
```

View recent logs with `check-server-status.bat`

## Windows Services Management

You can also manage the service using Windows Services:

1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "Cleansheet Development Server"
4. Right-click for Start/Stop/Restart options

## Troubleshooting

### Server won't start
- Check if port 8000 is already in use
- Run `check-server-status.bat` to see error messages
- Check `logs/service-error.log` for details

### Changes not auto-reloading
- Make sure the file is in the Cleansheet directory
- Try doing a hard refresh: `Ctrl + F5`
- Restart the server: `restart-server.bat`

### Port 8000 already in use
Edit `install-service.bat` and change `--port=8000` to another port (e.g., `--port=8080`), then reinstall the service.

### Permission errors
Make sure you ran `install-service.bat` as Administrator.

## Uninstalling

To completely remove the service:

1. **Right-click** `uninstall-service.bat`
2. Select **"Run as Administrator"**
3. Confirm removal

This will stop and remove the Windows service. You can reinstall anytime.

## Technical Details

**Service Configuration:**
- **Service Name**: CleansheetDevServer
- **Display Name**: Cleansheet Development Server
- **Executable**: C:\Program Files\nodejs\node.exe
- **Script**: live-server.js
- **Working Directory**: C:\Users\PaulGaljan\Github\Cleansheet
- **Startup Type**: Automatic
- **Port**: 8000
- **Features**: Auto-reload, CORS, No auto-browser launch

**NSSM Location:**
- C:\nssm\nssm-2.24\win64\nssm.exe

## Updating the Server

If you need to update live-server or change configuration:

1. Stop the server: `stop-server.bat`
2. Make your changes (update npm packages, edit config, etc.)
3. Start the server: `start-server.bat`

Or simply reinstall:
1. Run `uninstall-service.bat` as Administrator
2. Make your changes
3. Run `install-service.bat` as Administrator

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review NSSM documentation: https://nssm.cc/
- Review live-server documentation: https://www.npmjs.com/package/live-server

---

**Last Updated**: November 19, 2025
**Version**: 1.0
