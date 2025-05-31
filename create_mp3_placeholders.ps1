# Create Empty MP3 Files for Testing
#
# This script generates empty MP3 files for testing the game audio setup
# These should be replaced with actual audio files from Pixabay

Write-Host "===== Creating Empty MP3 Files for Testing =====" -ForegroundColor Cyan
Write-Host "Note: These are just placeholder files for testing functionality."
Write-Host "Replace them with real audio files from Pixabay for better game experience."
Write-Host ""

# Create audio directory if it doesn't exist
$audioDir = Join-Path $PSScriptRoot "public\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
    Write-Host "Created audio directory: $audioDir" -ForegroundColor Green
}

# List of required MP3 files
$audioFiles = @(
    "music.mp3",
    "engine.mp3",
    "brake.mp3", 
    "traffic.mp3"
)

# Create dummy MP3 files (minimal valid MP3 header)
foreach ($file in $audioFiles) {
    $filePath = Join-Path $audioDir $file
    
    # Only create if it doesn't exist
    if (-not (Test-Path $filePath)) {
        # Create a minimal valid MP3 file (ID3v2 tag + empty frame)
        $bytes = [byte[]]@(
            # ID3v2 header
            0x49, 0x44, 0x33,  # "ID3" identifier
            0x03, 0x00,        # Version 2.3.0
            0x00,              # No flags
            0x00, 0x00, 0x00, 0x0B,  # Tag size (11 bytes)
            
            # Empty audio frame
            0xFF, 0xFB, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00
        )
        
        [System.IO.File]::WriteAllBytes($filePath, $bytes)
        Write-Host "Created empty MP3 file: $file" -ForegroundColor Yellow
    } else {
        Write-Host "File already exists: $file" -ForegroundColor DarkYellow
    }
}

Write-Host "`nEmpty MP3 files have been created in: $audioDir"
Write-Host "`nIMPORTANT: These files are only placeholders for testing."
Write-Host "They contain minimal MP3 headers but no actual audio."
Write-Host "Please replace them with real audio files from Pixabay."
Write-Host "See docs/audio_download_guide.md for download links."

# Option to open the test page
$testPage = Join-Path $PSScriptRoot "public\test-audio.html"
if (Test-Path $testPage) {
    $openTest = Read-Host "`nWould you like to test these placeholder files now? (y/n)"
    if ($openTest -eq "y") {
        Write-Host "Opening audio test page in your browser..." -ForegroundColor Yellow
        Start-Process $testPage
    }
}

Write-Host "`nWhen you're ready to download real audio files, run:"
Write-Host ".\download_pixabay_audio.ps1" -ForegroundColor Cyan
