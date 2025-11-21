"""
Cleansheet Deployment Tool

Cross-platform Azure Blob Storage deployment automation.
Replaces bash scripts with Python for Windows/macOS/Linux compatibility.
"""

__version__ = "1.0.0"
__author__ = "Cleansheet LLC"

from .config import ConfigManager
from .azure_utils import AzureDeployment

__all__ = ['ConfigManager', 'AzureDeployment']
