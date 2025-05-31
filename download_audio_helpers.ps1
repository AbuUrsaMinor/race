# Download Audio Files Helper Script
#
# This script will create placeholder audio files that you can replace with actual sounds from Pixabay
# Run in PowerShell

# Create directory for audio files if it doesn't exist
$audioDir = Join-Path $PSScriptRoot "public\audio"
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null

# Create placeholder files with instructions inside
$files = @(
    "music.mp3",
    "engine.mp3",
    "brake.mp3",
    "traffic.mp3"
)

# Create empty placeholder files with .txt extension
foreach ($file in $files) {
    $placeholder = Join-Path $audioDir ($file + ".txt")
    "This is a placeholder for $file. Replace with actual audio downloaded from Pixabay." | Out-File -FilePath $placeholder -Encoding utf8
}

Write-Host "Audio placeholders created in: $audioDir"
Write-Host "Please download actual audio files from Pixabay and place them in this directory."
Write-Host "See docs\audio_integration_guide.md for detailed instructions."

# Open the guide for easy access
$guidePath = Join-Path $PSScriptRoot "docs\audio_integration_guide.md"
if (Test-Path $guidePath) {
    # Try to open with default markdown viewer if available
    try {
        Start-Process $guidePath
    }
    catch {
        # Open in text editor if markdown viewer fails
        notepad $guidePath
    }
}
