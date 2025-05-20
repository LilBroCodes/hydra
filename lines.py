import os
from pathlib import Path

# === Global ignore list: directories to exclude (by name) ===
IGNORED_FOLDERS = ['node_modules', '.git', '__pycache__', 'venv', "run", "package-lock.json", "yarn.lock", "LICENSE"]

def is_ignored(path: Path) -> bool:
    """Check if path is inside a folder we want to ignore."""
    return any(ignored in path.parts for ignored in IGNORED_FOLDERS)

def count_lines(file_path: Path) -> int:
    """Count the number of lines in a file safely."""
    try:
        with file_path.open("r", encoding="utf-8", errors="ignore") as f:
            return sum(1 for _ in f)
    except Exception:
        return 0

def collect_line_counts(base_dir: Path = Path(".")):
    line_counts = []
    total_lines = 0

    for root, dirs, files in os.walk(base_dir):
        # Filter out ignored directories in-place
        dirs[:] = [d for d in dirs if d not in IGNORED_FOLDERS]

        for file in files:
            file_path = Path(root) / file
            if is_ignored(file_path):
                continue
            lines = count_lines(file_path)
            line_counts.append((str(file_path), lines))
            total_lines += lines

    return sorted(line_counts, key=lambda x: x[1], reverse=True), total_lines

def print_table(line_counts, total_lines):
    print(f"{'File':<60} | {'Lines':>10}")
    print("-" * 75)
    for path, count in line_counts:
        print(f"{path:<60} | {count:>10}")
    print("-" * 75)
    print(f"{'Total':<60} | {total_lines:>10}")

if __name__ == "__main__":
    counts, total = collect_line_counts()
    print_table(counts, total)

