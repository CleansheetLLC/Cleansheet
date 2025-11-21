#!/usr/bin/env python3
"""
Cleansheet Deployment Tool

Cross-platform deployment automation for Azure Blob Storage.
Replaces bash scripts with Python for Windows/macOS/Linux compatibility.
"""

import sys
import click
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

# Initialize rich console for beautiful output
console = Console()

# Version info
VERSION = "1.0.0"


@click.group()
@click.version_option(version=VERSION, prog_name="Cleansheet Deploy")
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose output')
@click.option('--dry-run', is_flag=True, help='Show what would be done without making changes')
@click.pass_context
def cli(ctx, verbose, dry_run):
    """
    Cleansheet Deployment Tool

    Cross-platform Azure Blob Storage deployment automation.
    """
    # Store options in context for subcommands
    ctx.ensure_object(dict)
    ctx.obj['verbose'] = verbose
    ctx.obj['dry_run'] = dry_run

    # Show header
    if not ctx.invoked_subcommand:
        console.print(Panel.fit(
            "[bold blue]Cleansheet Deployment Tool[/bold blue]\n"
            f"Version {VERSION}",
            border_style="blue"
        ))


@cli.command()
@click.pass_context
def config(ctx):
    """
    Interactive configuration wizard.

    Set up deployment configuration for Azure Blob Storage.
    """
    from config import ConfigManager

    console.print(Panel.fit(
        "[bold blue]Cleansheet Deployment Configuration[/bold blue]",
        border_style="blue"
    ))

    config_mgr = ConfigManager()

    try:
        config_mgr.run_interactive_setup()
        console.print("\n[green][OK][/green] Configuration saved successfully!")
    except KeyboardInterrupt:
        console.print("\n[yellow]Configuration cancelled.[/yellow]")
        sys.exit(0)
    except Exception as e:
        console.print(f"\n[red][X][/red] Configuration failed: {e}")
        if ctx.obj['verbose']:
            console.print_exception()
        sys.exit(1)


@cli.command()
@click.pass_context
def full(ctx):
    """
    Full deployment with incremental sync.

    Deploys all files to Azure Blob Storage, syncing only changed files.
    Equivalent to deploy-to-azure.sh.
    """
    from config import ConfigManager
    from azure_utils import AzureDeployment

    console.print(Panel.fit(
        "[bold blue]Cleansheet Azure Deployment[/bold blue]",
        border_style="blue"
    ))

    verbose = ctx.obj['verbose']
    dry_run = ctx.obj['dry_run']

    if dry_run:
        console.print("[yellow]DRY RUN MODE - No changes will be made[/yellow]\n")

    try:
        # Load configuration
        config_mgr = ConfigManager()
        config = config_mgr.load_config()

        # Initialize Azure deployment
        deployer = AzureDeployment(config, verbose=verbose, dry_run=dry_run)

        # Run deployment
        deployer.deploy_full()

        console.print("\n[green][OK][/green] Deployment completed successfully!")

    except FileNotFoundError:
        console.print("[red][X][/red] Configuration not found. Run: [bold]python deploy.py config[/bold]")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red][X][/red] Deployment failed: {e}")
        if verbose:
            console.print_exception()
        sys.exit(1)


@cli.command()
@click.argument('target', required=False, default='career-canvas.html')
@click.pass_context
def quick(ctx, target):
    """
    Quick deployment for single file or directory.

    Fast deployment for testing. Only uploads the specified file/directory.
    Equivalent to quick-deploy.sh.

    TARGET: File or directory to deploy (default: career-canvas.html)
    """
    from config import ConfigManager
    from azure_utils import AzureDeployment

    console.print(Panel.fit(
        "[bold blue]Quick Deploy[/bold blue]",
        border_style="blue"
    ))

    verbose = ctx.obj['verbose']
    dry_run = ctx.obj['dry_run']

    if dry_run:
        console.print("[yellow]DRY RUN MODE - No changes will be made[/yellow]\n")

    try:
        # Load configuration
        config_mgr = ConfigManager()
        config = config_mgr.load_config()

        # Initialize Azure deployment
        deployer = AzureDeployment(config, verbose=verbose, dry_run=dry_run)

        # Run quick deployment
        deployer.deploy_quick(target)

        console.print("\n[green][OK][/green] Deploy complete!")

    except FileNotFoundError as e:
        if 'config.yaml' in str(e):
            console.print("[red][X][/red] Configuration not found. Run: [bold]python deploy.py config[/bold]")
        else:
            console.print(f"[red][X][/red] File not found: {target}")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red][X][/red] Deployment failed: {e}")
        if verbose:
            console.print_exception()
        sys.exit(1)


@cli.command()
@click.option('--mode', type=click.Choice(['quick', 'full', 'skip']), default='quick',
              help='Deployment mode before testing (default: quick)')
@click.option('--skip-deploy', is_flag=True, help='Skip deployment, run tests only')
@click.pass_context
def test(ctx, mode, skip_deploy):
    """
    Run end-to-end tests with deployment.

    Deploys to Azure and runs automated Playwright tests.
    Equivalent to test-e2e.sh.
    """
    from config import ConfigManager
    from azure_utils import AzureDeployment
    import subprocess
    import time

    console.print(Panel.fit(
        "[bold blue]Cleansheet E2E Test Suite[/bold blue]",
        border_style="blue"
    ))

    verbose = ctx.obj['verbose']
    dry_run = ctx.obj['dry_run']

    try:
        # Load configuration
        config_mgr = ConfigManager()
        config = config_mgr.load_config()

        # Step 1: Deploy to Azure (if not skipped)
        if not skip_deploy and mode != 'skip':
            console.print("\n[bold]Step 1: Deploy to Azure[/bold]")
            deployer = AzureDeployment(config, verbose=verbose, dry_run=dry_run)

            if mode == 'quick':
                deployer.deploy_quick('career-canvas.html')
            elif mode == 'full':
                deployer.deploy_full()

            # Wait for Azure propagation
            if not dry_run:
                console.print("Waiting 3 seconds for Azure propagation...")
                time.sleep(3)
        else:
            console.print("\n[yellow]Skipping deployment[/yellow]")

        # Step 2: Check test dependencies
        console.print("\n[bold]Step 2: Check Test Dependencies[/bold]")

        tests_dir = Path(__file__).parent.parent / 'tests'
        node_modules = tests_dir / 'node_modules'

        if not node_modules.exists():
            console.print("[yellow]Test dependencies not installed[/yellow]")
            console.print("Installing Playwright and dependencies...")

            if not dry_run:
                subprocess.run(['npm', 'install'], cwd=tests_dir, check=True)
                subprocess.run(['npx', 'playwright', 'install', 'chromium'], cwd=tests_dir, check=True)

            console.print("[green][OK][/green] Dependencies installed!")
        else:
            console.print("[green][OK][/green] Dependencies already installed")

        # Step 3: Run tests
        console.print("\n[bold]Step 3: Run Automated Tests[/bold]")

        if not dry_run:
            console.print("Running Playwright tests...\n")

            result = subprocess.run(
                ['npx', 'playwright', 'test', '--reporter=list'],
                cwd=tests_dir,
                capture_output=False
            )

            if result.returncode == 0:
                console.print("\n[green][OK][/green] All tests passed!")
                console.print(f"\nView report: {tests_dir}/playwright-report/index.html")
            else:
                console.print("\n[red][X][/red] Some tests failed")
                console.print(f"View report: {tests_dir}/playwright-report/index.html")
                console.print(f"View traces: {tests_dir}/test-results/")
                sys.exit(1)
        else:
            console.print("[yellow]DRY RUN - Skipping test execution[/yellow]")

    except FileNotFoundError:
        console.print("[red][X][/red] Configuration not found. Run: [bold]python deploy.py config[/bold]")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        console.print(f"\n[red][X][/red] Test command failed: {e}")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red][X][/red] Testing failed: {e}")
        if verbose:
            console.print_exception()
        sys.exit(1)


def main():
    """Main entry point."""
    cli(obj={})


if __name__ == '__main__':
    main()
