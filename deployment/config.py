"""
Configuration management for Cleansheet deployment.

Handles interactive configuration wizard, YAML file management,
and configuration validation.
"""

import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional
import yaml
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.table import Table

console = Console()


class ConfigManager:
    """Manages deployment configuration."""

    def __init__(self, config_path: Optional[Path] = None):
        """
        Initialize configuration manager.

        Args:
            config_path: Path to config file. Defaults to deployment/config.yaml
        """
        if config_path is None:
            self.config_path = Path(__file__).parent / 'config.yaml'
        else:
            self.config_path = Path(config_path)

        self.config_example_path = Path(__file__).parent / 'config.yaml.example'

    def load_config(self) -> Dict[str, Any]:
        """
        Load configuration from YAML file.

        Returns:
            Configuration dictionary

        Raises:
            FileNotFoundError: If config file doesn't exist
        """
        if not self.config_path.exists():
            raise FileNotFoundError(
                f"Configuration file not found: {self.config_path}\n"
                "Run 'python deploy.py config' to create one."
            )

        with open(self.config_path, 'r') as f:
            config = yaml.safe_load(f)

        return config

    def save_config(self, config: Dict[str, Any]) -> None:
        """
        Save configuration to YAML file.

        Args:
            config: Configuration dictionary to save
        """
        with open(self.config_path, 'w') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)

        console.print(f"[green][OK][/green] Configuration saved to: {self.config_path}")

    def validate_config(self, config: Dict[str, Any]) -> bool:
        """
        Validate configuration.

        Args:
            config: Configuration dictionary to validate

        Returns:
            True if valid, False otherwise
        """
        required_fields = [
            'storage_account',
            'container_name',
            'resource_group',
            'repo_path'
        ]

        for field in required_fields:
            if field not in config or not config[field]:
                console.print(f"[red][X][/red] Missing required field: {field}")
                return False

        # Validate repo path exists
        repo_path = Path(config['repo_path'])
        if not repo_path.exists():
            console.print(f"[red][X][/red] Repository path does not exist: {repo_path}")
            return False

        return True

    def run_interactive_setup(self) -> Dict[str, Any]:
        """
        Run interactive configuration wizard.

        Returns:
            Configuration dictionary
        """
        console.print("\n[bold]Interactive Configuration Setup[/bold]\n")

        # Load existing config if available
        existing_config = {}
        if self.config_path.exists():
            try:
                existing_config = self.load_config()
                console.print("[yellow]Found existing configuration. Press Enter to keep current values.[/yellow]\n")
            except Exception:
                pass

        # Get current directory as default repo path
        current_dir = Path.cwd()

        # Azure settings
        console.print("[bold cyan]Azure Settings[/bold cyan]")

        storage_account = Prompt.ask(
            "Storage Account Name",
            default=existing_config.get('storage_account', 'cleansheetcorpus')
        )

        container_name = Prompt.ask(
            "Container Name",
            default=existing_config.get('container_name', 'web')
        )

        resource_group = Prompt.ask(
            "Resource Group",
            default=existing_config.get('resource_group', 'Storage')
        )

        # Repository settings
        console.print("\n[bold cyan]Repository Settings[/bold cyan]")

        repo_path = Prompt.ask(
            "Repository Path",
            default=str(existing_config.get('repo_path', current_dir))
        )

        # Exclude patterns
        console.print("\n[bold cyan]Exclude Patterns[/bold cyan]")
        console.print("Enter file patterns to exclude from sync (comma-separated)")

        default_excludes = existing_config.get('exclude_patterns', [
            '.git/*',
            '.gitignore',
            'node_modules/*',
            '*.md',
            '.claude/*',
            'deploy-to-azure.sh',
            'quick-deploy.sh',
            'test-e2e.sh',
            '*.py',
            'meta/*',
            'lexical-bundle/*',
            '.vscode/*',
            '*.swp',
            '*.bak',
            '*~',
            'deployment/*'
        ])

        exclude_str = Prompt.ask(
            "Exclude patterns",
            default=','.join(default_excludes)
        )

        exclude_patterns = [p.strip() for p in exclude_str.split(',') if p.strip()]

        # Build configuration
        config = {
            'storage_account': storage_account,
            'container_name': container_name,
            'resource_group': resource_group,
            'repo_path': repo_path,
            'exclude_patterns': exclude_patterns
        }

        # Validate configuration
        if not self.validate_config(config):
            console.print("\n[red]Configuration validation failed.[/red]")
            sys.exit(1)

        # Show summary
        self.show_config_summary(config)

        # Confirm save
        if Confirm.ask("\nSave this configuration?", default=True):
            self.save_config(config)
            return config
        else:
            console.print("[yellow]Configuration not saved.[/yellow]")
            sys.exit(0)

    def show_config_summary(self, config: Dict[str, Any]) -> None:
        """
        Display configuration summary in a table.

        Args:
            config: Configuration dictionary to display
        """
        console.print("\n[bold]Configuration Summary[/bold]\n")

        table = Table(show_header=False, box=None)
        table.add_column("Setting", style="cyan", no_wrap=True)
        table.add_column("Value", style="white")

        table.add_row("Storage Account", config['storage_account'])
        table.add_row("Container Name", config['container_name'])
        table.add_row("Resource Group", config['resource_group'])
        table.add_row("Repository Path", config['repo_path'])
        table.add_row(
            "Exclude Patterns",
            f"{len(config['exclude_patterns'])} patterns"
        )

        console.print(table)

        # Show exclude patterns in detail if verbose
        if len(config['exclude_patterns']) > 0:
            console.print("\n[dim]Exclude patterns:[/dim]")
            for pattern in config['exclude_patterns'][:5]:
                console.print(f"  [dim]• {pattern}[/dim]")
            if len(config['exclude_patterns']) > 5:
                console.print(f"  [dim]• ... and {len(config['exclude_patterns']) - 5} more[/dim]")

    def get_config_value(self, key: str, default: Any = None) -> Any:
        """
        Get a single configuration value.

        Args:
            key: Configuration key
            default: Default value if key not found

        Returns:
            Configuration value or default
        """
        try:
            config = self.load_config()
            return config.get(key, default)
        except FileNotFoundError:
            return default
