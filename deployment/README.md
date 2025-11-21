# Cleansheet Deployment Tool

Cross-platform Python deployment automation for Azure Blob Storage.

## Quick Start

### 1. Install Dependencies

```bash
cd deployment
pip install -r requirements.txt
```

### 2. Configure Deployment

Run the interactive configuration wizard:

```bash
python deploy.py config
```

This will create a `config.yaml` file with your Azure settings.

### 3. Deploy

**Full deployment** (all files, incremental sync):
```bash
python deploy.py full
```

**Quick deployment** (single file for testing):
```bash
python deploy.py quick career-canvas.html
```

**Run E2E tests**:
```bash
python deploy.py test
```

## Commands

### `config` - Interactive Configuration

Set up deployment configuration interactively.

```bash
python deploy.py config
```

### `full` - Full Deployment

Deploy all files with incremental sync (only uploads changed files).

```bash
python deploy.py full
python deploy.py full --verbose    # Show detailed output
python deploy.py full --dry-run    # Preview without making changes
```

Equivalent to: `deploy-to-azure.sh`

### `quick` - Quick Deployment

Fast deployment for single file or directory. Perfect for testing.

```bash
python deploy.py quick career-canvas.html
python deploy.py quick shared/
```

Equivalent to: `quick-deploy.sh`

### `test` - E2E Testing

Deploy and run automated Playwright tests.

```bash
python deploy.py test                    # Quick deploy + tests
python deploy.py test --mode full        # Full deploy + tests
python deploy.py test --skip-deploy      # Tests only (no deploy)
```

Equivalent to: `test-e2e.sh`

## Configuration

Configuration is stored in `deployment/config.yaml`:

```yaml
storage_account: cleansheetcorpus
container_name: web
resource_group: Storage
repo_path: C:\Users\PaulGaljan\Github\Cleansheet
exclude_patterns:
  - .git/*
  - node_modules/*
  - '*.md'
  - deployment/*
```

### Manual Configuration

Copy `config.yaml.example` to `config.yaml` and edit:

```bash
cp config.yaml.example config.yaml
# Edit config.yaml with your values
```

## Global Options

- `--verbose` / `-v` - Show detailed output including Azure CLI commands
- `--dry-run` - Preview changes without executing them
- `--help` - Show help for any command

Examples:
```bash
python deploy.py --verbose full
python deploy.py --dry-run quick index.html
```

## Prerequisites

- **Python 3.10+**
- **Azure CLI** - Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
- **Azure account** - Must be logged in: `az login`

## Features

✅ **Cross-platform** - Works on Windows, macOS, and Linux
✅ **Incremental sync** - Only uploads changed files
✅ **Beautiful output** - Color-coded with progress bars
✅ **Interactive config** - Easy setup wizard
✅ **Dry-run mode** - Test before deploying
✅ **Content type detection** - Automatic MIME type setting
✅ **E2E testing** - Integrated Playwright test orchestration

## Troubleshooting

### "Configuration not found"

Run the configuration wizard:
```bash
python deploy.py config
```

### "Azure CLI not installed"

Install Azure CLI:
- **Windows**: https://aka.ms/installazurecliwindows
- **macOS**: `brew install azure-cli`
- **Linux**: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux

### "Not logged in to Azure"

Login to Azure:
```bash
az login
```

### Import errors

Install dependencies:
```bash
pip install -r requirements.txt
```

## Migration from Bash Scripts

| Old Bash Script | New Python Command |
|----------------|-------------------|
| `./deploy-to-azure.sh` | `python deploy.py full` |
| `./quick-deploy.sh career-canvas.html` | `python deploy.py quick career-canvas.html` |
| `./test-e2e.sh quick` | `python deploy.py test --mode quick` |

## Development

### Project Structure

```
deployment/
├── deploy.py              # Main CLI entry point
├── config.py             # Configuration management
├── azure_utils.py        # Azure CLI wrapper functions
├── requirements.txt      # Python dependencies
├── config.yaml.example   # Example configuration
├── README.md            # This file
├── docs/                # Additional documentation
└── tests/               # Unit tests
```

### Running Tests

```bash
cd deployment
pytest tests/
```

## Support

- **Documentation**: See `docs/` directory
- **Issues**: https://github.com/CleansheetLLC/Cleansheet/issues
- **CLAUDE.md**: Architecture and development guidelines

## Version

Current version: **1.0.0**

Last updated: 2025-11-21
