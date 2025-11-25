"""
Azure CLI wrapper utilities for Cleansheet deployment.

Provides Python interfaces to Azure CLI commands for storage operations.
"""

import os
import sys
import subprocess
import json
import mimetypes
import platform
import tempfile
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
from rich.console import Console
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TimeRemainingColumn,
    TaskProgressColumn
)

console = Console()

# Determine Azure CLI command based on platform
AZ_CMD = 'az.cmd' if platform.system() == 'Windows' else 'az'


def is_wsl() -> bool:
    """
    Check if running in WSL (Windows Subsystem for Linux).

    Returns:
        True if running in WSL, False otherwise
    """
    try:
        with open('/proc/version', 'r') as f:
            return 'microsoft' in f.read().lower()
    except:
        return False


def wsl_path_to_windows(path: Path) -> str:
    """
    Convert WSL path to Windows path for azcopy.exe compatibility.

    Examples:
        /mnt/c/Users/... -> C:\\Users\\...
        /mnt/d/Data/... -> D:\\Data\\...

    Args:
        path: Path object (WSL format)

    Returns:
        Windows-formatted path string
    """
    path_str = str(path)

    # Check if it's a WSL mount point
    if path_str.startswith('/mnt/'):
        # Extract drive letter and remaining path
        parts = path_str[5:].split('/', 1)
        if len(parts) >= 1:
            drive_letter = parts[0].upper()
            remaining_path = parts[1] if len(parts) > 1 else ''

            # Convert to Windows path
            windows_path = f"{drive_letter}:\\" + remaining_path.replace('/', '\\')
            return windows_path

    # Not a WSL mount point, return as-is
    return path_str


class AzureDeployment:
    """Handles Azure Blob Storage deployment operations."""

    def __init__(self, config: Dict[str, Any], verbose: bool = False, dry_run: bool = False):
        """
        Initialize Azure deployment.

        Args:
            config: Configuration dictionary from ConfigManager
            verbose: Enable verbose output
            dry_run: Show what would be done without making changes
        """
        self.config = config
        self.verbose = verbose
        self.dry_run = dry_run

        self.storage_account = config['storage_account']
        self.container_name = config['container_name']
        self.resource_group = config['resource_group']
        self.repo_path = Path(config['repo_path'])
        self.exclude_patterns = config.get('exclude_patterns', [])

        # Initialize mimetypes
        mimetypes.init()

    def _run_az_command(self, args: List[str], capture_output: bool = True,
                       check: bool = True) -> subprocess.CompletedProcess:
        """
        Run Azure CLI command.

        Args:
            args: Command arguments (without 'az' prefix)
            capture_output: Capture stdout/stderr
            check: Raise exception on non-zero return code

        Returns:
            CompletedProcess instance

        Raises:
            subprocess.CalledProcessError: If command fails and check=True
        """
        cmd = [AZ_CMD] + args

        if self.verbose:
            console.print(f"[dim]Running: {' '.join(cmd)}[/dim]")

        if self.dry_run:
            console.print(f"[yellow]DRY RUN:[/yellow] {' '.join(cmd)}")
            # Return fake successful result for dry run
            return subprocess.CompletedProcess(
                cmd, 0, stdout=b'{}', stderr=b''
            )

        try:
            result = subprocess.run(
                cmd,
                capture_output=capture_output,
                check=check,
                text=False,  # Get bytes, decode manually
                shell=False  # Don't use shell on Windows for security
            )
            return result
        except FileNotFoundError as e:
            # Command not found in PATH
            if self.verbose:
                console.print(f"[red]Command not found:[/red] {cmd[0]}")
                console.print(f"[dim]Make sure Azure CLI is installed and in your PATH[/dim]")
            raise
        except subprocess.CalledProcessError as e:
            console.print(f"[red]Command failed:[/red] {' '.join(cmd)}")
            if e.stderr:
                console.print(f"[red]{e.stderr.decode('utf-8', errors='ignore')}[/red]")
            raise

    def check_prerequisites(self) -> None:
        """
        Check prerequisites for deployment.

        Verifies:
        - Azure CLI is installed
        - User is logged in to Azure
        - Repository directory exists
        """
        console.print("[bold]Checking Prerequisites[/bold]\n")

        # Check Azure CLI
        try:
            result = self._run_az_command(['--version'])
            version_line = result.stdout.decode('utf-8').split('\n')[0]
            console.print(f"[green][OK][/green] Azure CLI installed: {version_line}")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            console.print("[red][X][/red] Azure CLI not installed or not in PATH")
            console.print("Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli")
            if self.verbose:
                console.print(f"[dim]Error: {e}[/dim]")
            sys.exit(1)

        # Check Azure login
        try:
            result = self._run_az_command(['account', 'show', '--query', 'name', '-o', 'tsv'])
            account_name = result.stdout.decode('utf-8').strip()
            console.print(f"[green][OK][/green] Logged in to Azure: {account_name}")
        except subprocess.CalledProcessError:
            console.print("[red][X][/red] Not logged in to Azure")
            console.print("Run: [bold]az login[/bold]")
            sys.exit(1)

        # Check repository directory
        if not self.repo_path.exists():
            console.print(f"[red][X][/red] Repository directory not found: {self.repo_path}")
            sys.exit(1)
        console.print(f"[green][OK][/green] Repository directory: {self.repo_path}")

        console.print("\n[green][OK][/green] All prerequisites met!\n")

    def verify_storage_account(self) -> str:
        """
        Verify storage account exists and get account key.

        Returns:
            Storage account key

        Raises:
            SystemExit: If storage account doesn't exist
        """
        console.print("[bold]Verifying Storage Account[/bold]\n")

        # Check if storage account exists
        try:
            self._run_az_command([
                'storage', 'account', 'show',
                '--name', self.storage_account,
                '--resource-group', self.resource_group
            ])
            console.print(f"[green][OK][/green] Storage account verified: {self.storage_account}")
        except subprocess.CalledProcessError:
            console.print(f"[red][X][/red] Storage account '{self.storage_account}' not found")
            console.print(f"Create one with: az storage account create --name {self.storage_account} "
                        f"--resource-group {self.resource_group} --location eastus --sku Standard_LRS")
            sys.exit(1)

        # Get storage account key
        result = self._run_az_command([
            'storage', 'account', 'keys', 'list',
            '--resource-group', self.resource_group,
            '--account-name', self.storage_account,
            '--query', '[0].value',
            '-o', 'tsv'
        ])
        account_key = result.stdout.decode('utf-8').strip()

        # Check if container exists
        result = self._run_az_command([
            'storage', 'container', 'exists',
            '--account-name', self.storage_account,
            '--account-key', account_key,
            '--name', self.container_name,
            '--query', 'exists',
            '-o', 'tsv'
        ])

        exists = result.stdout.decode('utf-8').strip().lower() == 'true'

        if not exists:
            console.print(f"[yellow]Container '{self.container_name}' does not exist. Creating...[/yellow]")
            self._run_az_command([
                'storage', 'container', 'create',
                '--account-name', self.storage_account,
                '--account-key', account_key,
                '--name', self.container_name,
                '--public-access', 'blob'
            ])
            console.print(f"[green][OK][/green] Container created: {self.container_name}")
        else:
            console.print(f"[green][OK][/green] Container verified: {self.container_name}")

        console.print()
        return account_key

    def deploy_full(self) -> None:
        """
        Full deployment using azcopy directly.

        Uploads all files from repository to Azure Blob Storage using azcopy copy.
        Uses azcopy directly to avoid az storage blob sync bugs.
        """
        # Check prerequisites
        self.check_prerequisites()

        # Verify storage account and get key
        account_key = self.verify_storage_account()

        console.print("[bold]Uploading Files to Azure Blob Storage[/bold]\n")
        console.print(f"Source: {self.repo_path}")
        console.print(f"Destination: {self.storage_account}/{self.container_name}")
        console.print(f"Excluding: {len(self.exclude_patterns)} patterns\n")

        if not self.dry_run:
            console.print("Starting upload...\n")

        # Convert path for azcopy if running in WSL
        source_path = str(self.repo_path)
        if is_wsl():
            source_path = wsl_path_to_windows(self.repo_path)
            if self.verbose:
                console.print(f"[dim]WSL detected: Converting path to {source_path}[/dim]")

        # Ensure source path ends with /* for recursive copy
        if not source_path.endswith('\\*') and not source_path.endswith('/*'):
            source_path = source_path.rstrip('\\/') + '/*'

        # Generate SAS token for azcopy
        sas_token = self._generate_sas_token(account_key)

        # Build destination URL with SAS
        dest_url = f"https://{self.storage_account}.blob.core.windows.net/{self.container_name}?{sas_token}"

        # Run azcopy copy command
        try:
            # Build exclude patterns - semicolon separated for azcopy
            exclude_pattern = ';'.join(self.exclude_patterns)

            # Determine azcopy command - in WSL, use the Windows version
            azcopy_cmd = 'azcopy'
            if is_wsl():
                # Use the azcopy.exe from Azure CLI installation
                azcopy_windows_path = Path('/mnt/c/Users') / os.environ.get('USER', 'PaulGaljan') / '.azure/bin/azcopy.exe'
                if not azcopy_windows_path.exists():
                    # Try with the username from the repo path
                    parts = str(self.repo_path).split('/')
                    if 'Users' in parts:
                        user_idx = parts.index('Users') + 1
                        if user_idx < len(parts):
                            username = parts[user_idx]
                            azcopy_windows_path = Path(f'/mnt/c/Users/{username}/.azure/bin/azcopy.exe')
                if azcopy_windows_path.exists():
                    azcopy_cmd = str(azcopy_windows_path)
                    if self.verbose:
                        console.print(f"[dim]Using azcopy at: {azcopy_cmd}[/dim]")

            cmd = [
                azcopy_cmd, 'copy',
                source_path,
                dest_url,
                '--recursive=true',
                '--overwrite=true',
                f'--exclude-pattern={exclude_pattern}'
            ]

            if self.verbose:
                console.print(f"[dim]Running: azcopy copy ... (patterns hidden)[/dim]")

            if self.dry_run:
                # Mask the SAS token for dry run display
                display_cmd = cmd.copy()
                display_cmd[2] = f"https://{self.storage_account}.blob.core.windows.net/{self.container_name}?[SAS_TOKEN]"
                console.print(f"[yellow]DRY RUN:[/yellow] azcopy copy {source_path} [DEST_URL] --recursive=true --overwrite=true --exclude-pattern=...")
            else:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    check=True
                )

                # Parse output for statistics
                output = result.stdout + result.stderr
                if self.verbose:
                    console.print(f"[dim]{output}[/dim]")

                console.print(f"[green][OK][/green] Upload complete!")

        except subprocess.CalledProcessError as e:
            console.print("[red][X][/red] Upload failed")
            if e.stderr:
                console.print(f"[red]{e.stderr}[/red]")
            raise
        except FileNotFoundError:
            console.print("[red][X][/red] azcopy not found in PATH")
            console.print("Install azcopy or ensure it's in your PATH")
            raise

        # Display website URL
        self._show_website_url()

    def _generate_sas_token(self, account_key: str) -> str:
        """
        Generate a SAS token for the storage account.

        Args:
            account_key: Storage account key

        Returns:
            SAS token string
        """
        from datetime import datetime, timedelta

        # Calculate expiry time (1 hour from now)
        expiry = (datetime.utcnow() + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%MZ')

        # Generate SAS token using az cli
        result = self._run_az_command([
            'storage', 'account', 'generate-sas',
            '--account-name', self.storage_account,
            '--account-key', account_key,
            '--services', 'b',
            '--resource-types', 'co',
            '--permissions', 'rwdlac',
            '--expiry', expiry,
            '-o', 'tsv'
        ])

        return result.stdout.decode('utf-8').strip()

    def deploy_quick(self, target: str) -> None:
        """
        Quick deployment for single file or directory.

        Args:
            target: File or directory path relative to repo_path
        """
        # Check prerequisites
        self.check_prerequisites()

        # Verify storage account and get key
        account_key = self.verify_storage_account()

        # Resolve target path
        target_path = self.repo_path / target

        if not target_path.exists():
            console.print(f"[red][X][/red] Target not found: {target_path}")
            sys.exit(1)

        console.print(f"[bold]Uploading:[/bold] {target}\n")

        if target_path.is_file():
            self._upload_file(target_path, target, account_key)
        elif target_path.is_dir():
            self._upload_directory(target_path, target, account_key)

        # Display URL
        self._show_file_url(target)

    def _upload_file(self, file_path: Path, blob_name: str, account_key: str) -> None:
        """
        Upload a single file to Azure Blob Storage.

        Args:
            file_path: Local file path
            blob_name: Blob name in container
            account_key: Storage account key
        """
        # Determine content type
        content_type = self._get_content_type(file_path)

        # Check if this is career-canvas.html and inject timestamp
        temp_file = None
        upload_path = file_path

        if blob_name == 'career-canvas.html':
            try:
                # Generate timestamp from file modification time
                timestamp = self._format_file_timestamp(file_path)

                # Inject timestamp into HTML
                temp_file = self._inject_timestamp_to_html(file_path, timestamp)
                upload_path = temp_file

                console.print(f"Uploading {blob_name} with timestamp {timestamp}...")
            except Exception as e:
                console.print(f"[yellow]Warning: Could not inject timestamp: {e}[/yellow]")
                console.print(f"Uploading {blob_name} without timestamp...")
        else:
            console.print(f"Uploading {blob_name}...")

        try:
            # Convert path for Azure CLI if running in WSL
            file_arg = str(upload_path)
            if is_wsl():
                file_arg = wsl_path_to_windows(upload_path)
                if self.verbose and temp_file:
                    console.print(f"[dim]WSL detected: Converting temp file path to {file_arg}[/dim]")

            self._run_az_command([
                'storage', 'blob', 'upload',
                '--account-name', self.storage_account,
                '--account-key', account_key,
                '--container-name', self.container_name,
                '--name', blob_name,
                '--file', file_arg,
                '--content-type', content_type,
                '--content-cache-control', 'public, max-age=3600',
                '--overwrite', 'true',
                '--no-progress'
            ])

            if not self.dry_run:
                file_size_kb = upload_path.stat().st_size / 1024
                console.print(f"[green][OK][/green] Uploaded: {blob_name} ({file_size_kb:.1f} KB)")

        except subprocess.CalledProcessError:
            console.print(f"[red][X][/red] Failed to upload: {blob_name}")
            raise
        finally:
            # Clean up temporary file if it was created
            if temp_file and temp_file.exists():
                try:
                    temp_file.unlink()
                    if self.verbose:
                        console.print(f"[dim]Cleaned up temporary file[/dim]")
                except Exception as e:
                    if self.verbose:
                        console.print(f"[yellow]Warning: Could not delete temp file: {e}[/yellow]")

    def _upload_directory(self, dir_path: Path, blob_prefix: str, account_key: str) -> None:
        """
        Upload a directory to Azure Blob Storage.

        Args:
            dir_path: Local directory path
            blob_prefix: Blob prefix in container
            account_key: Storage account key
        """
        console.print(f"Uploading directory: {blob_prefix}...")

        try:
            self._run_az_command([
                'storage', 'blob', 'upload-batch',
                '--account-name', self.storage_account,
                '--account-key', account_key,
                '--destination', self.container_name,
                '--source', str(dir_path),
                '--pattern', '*',
                '--overwrite', 'true',
                '--no-progress'
            ])

            if not self.dry_run:
                console.print(f"[green][OK][/green] Uploaded directory: {blob_prefix}")

        except subprocess.CalledProcessError:
            console.print(f"[red][X][/red] Failed to upload directory: {blob_prefix}")
            raise

    def _get_content_type(self, file_path: Path) -> str:
        """
        Determine content type for a file.

        Args:
            file_path: File path

        Returns:
            Content type string
        """
        content_type_map = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
        }

        ext = file_path.suffix.lower()
        return content_type_map.get(ext, 'application/octet-stream')

    def _format_file_timestamp(self, file_path: Path) -> str:
        """
        Get file modification timestamp in YYMMDD.hhmm format (UTC).

        Args:
            file_path: File path

        Returns:
            Formatted timestamp string (e.g., "251124.1430")
        """
        # Get file modification time
        mtime = file_path.stat().st_mtime

        # Convert to UTC datetime
        dt_utc = datetime.utcfromtimestamp(mtime)

        # Format as YYMMDD.hhmm
        timestamp = dt_utc.strftime("%y%m%d.%H%M")

        return timestamp

    def _inject_timestamp_to_html(self, file_path: Path, timestamp: str) -> Path:
        """
        Inject timestamp into HTML file before copyright notice.

        Args:
            file_path: Original HTML file path
            timestamp: Formatted timestamp string

        Returns:
            Path to temporary file with injected timestamp
        """
        # Read original file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Create timestamp HTML element
        timestamp_html = f'''                <!-- Build Timestamp -->
                <div style="position: absolute; bottom: 8px; left: 16px; font-family: var(--font-family-body); font-size: 11px; color: var(--color-neutral-text); font-weight: 500; opacity: 0.7; z-index: 5;">
                    {timestamp}
                </div>

                '''

        # Find copyright notice and inject timestamp before it
        copyright_marker = '                <!-- Copyright Notice -->'

        if copyright_marker in content:
            content = content.replace(copyright_marker, timestamp_html + copyright_marker)

            if self.verbose:
                console.print(f"[dim]Injected timestamp: {timestamp}[/dim]")
        else:
            console.print("[yellow]Warning: Copyright marker not found in HTML, skipping timestamp injection[/yellow]")

        # Create temporary file in Windows-accessible location when running in WSL
        if is_wsl():
            # Use repo directory for temp file (Windows accessible)
            temp_dir = self.repo_path
            temp_file_path = temp_dir / f'.tmp_career_canvas_{timestamp}.html'

            with open(temp_file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            return temp_file_path
        else:
            # Use system temp directory
            temp_file = tempfile.NamedTemporaryFile(mode='w', encoding='utf-8',
                                                    suffix='.html', delete=False)
            temp_file.write(content)
            temp_file.close()

            return Path(temp_file.name)

    def _show_website_url(self) -> None:
        """Display the website URL after deployment."""
        # Get blob endpoint
        result = self._run_az_command([
            'storage', 'account', 'show',
            '--name', self.storage_account,
            '--resource-group', self.resource_group,
            '--query', 'primaryEndpoints.blob',
            '-o', 'tsv'
        ])

        blob_endpoint = result.stdout.decode('utf-8').strip()
        container_url = f"{blob_endpoint}{self.container_name}"

        console.print("\n[bold]Deployment URLs[/bold]")
        console.print(f"Container: {container_url}")
        console.print(f"Index: {container_url}/index.html")

    def _show_file_url(self, target: str) -> None:
        """
        Display the URL for a specific file.

        Args:
            target: Target file path
        """
        # Get blob endpoint
        result = self._run_az_command([
            'storage', 'account', 'show',
            '--name', self.storage_account,
            '--resource-group', self.resource_group,
            '--query', 'primaryEndpoints.blob',
            '-o', 'tsv'
        ])

        blob_endpoint = result.stdout.decode('utf-8').strip()
        file_url = f"{blob_endpoint}{self.container_name}/{target}"

        console.print(f"\n[bold]URL:[/bold] {file_url}")
