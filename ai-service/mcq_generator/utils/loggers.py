import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define color codes for different log levels
LOG_COLORS = {
    "INFO": "\033[92m",     # Green
    "WARNING": "\033[93m",  # Yellow
    "ERROR": "\033[91m",    # Red
    "RESET": "\033[0m"      # Reset to default
}

class ColoredFormatter(logging.Formatter):
    """
    Custom formatter to colorize the entire log line based on log level.
    """
    def format(self, record):
        log_color = LOG_COLORS.get(record.levelname, LOG_COLORS["RESET"])
        formatted_message = super().format(record)
        return f"{log_color}{formatted_message}{LOG_COLORS['RESET']}"

def setup_logger(name, level=logging.INFO):
    """
    Setup and return a logger instance with color-coded output.
    """
    logger = logging.getLogger(name)

    if not logger.hasHandlers():
        formatter = ColoredFormatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)

        logger.setLevel(level)
        logger.addHandler(console_handler)

    return logger