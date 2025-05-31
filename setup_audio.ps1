# Race Game Audio Setup Script
#
# This script sets up the audio environment for the Race Game by:
# 1. Creating placeholder MP3 files
# 2. Providing instructions for downloading real audio files
# 3. Offering to test both placeholder and real audio files

# Helper function for colored output
function Write-ColorOutput {
    param (
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

Write-ColorOutput "===== Race Game Audio Setup =====" "Cyan"
Write-ColorOutput "This script will help you prepare the audio files for the Race Game."
Write-ColorOutput ""

# Create audio directory if it doesn't exist
$audioDir = Join-Path $PSScriptRoot "public\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
    Write-ColorOutput "Created audio directory: $audioDir" "Green"
}

# Clear any duplicate files (in case of previous runs)
Get-ChildItem -Path $audioDir -Filter "*.mp3" | ForEach-Object {
    Remove-Item -Path $_.FullName -Force
    Write-ColorOutput "Removed old file: $($_.Name)" "Yellow"
}

# Create placeholder MP3 files
$audioFiles = @("music.mp3", "engine.mp3", "brake.mp3", "traffic.mp3")

foreach ($file in $audioFiles) {
    $filePath = Join-Path $audioDir $file
    New-Item -ItemType File -Path $filePath -Force | Out-Null
    Write-ColorOutput "Created placeholder file: $file" "Yellow"
}

Write-ColorOutput "`nPlaceholder MP3 files have been created in: $audioDir" "Green"

# Explain what the placeholders are for
Write-ColorOutput "`nIMPORTANT:" "Magenta"
Write-ColorOutput "These placeholder files are empty and won't produce any sound."
Write-ColorOutput "They're just there to prevent errors in the game code."
Write-ColorOutput "For a better gaming experience, you should download real audio files."

# Offer to open the download guide
$downloadGuide = Join-Path $PSScriptRoot "docs\audio_download_guide.md"
$openGuide = Read-Host "`nWould you like to see the download guide for real audio files? (y/n)"
if ($openGuide -eq "y") {
    if (Test-Path $downloadGuide) {
        Write-ColorOutput "Opening audio download guide..." "Yellow"
        try {
            Start-Process $downloadGuide
        } catch {
            notepad $downloadGuide
        }
    } else {
        Write-ColorOutput "Download guide not found at: $downloadGuide" "Red"
        
        # Display built-in guide if the file doesn't exist
        Write-ColorOutput "`n--- QUICK DOWNLOAD GUIDE ---" "Cyan"
        Write-ColorOutput "1. Visit https://pixabay.com/sound-effects/ or https://pixabay.com/music/"
        Write-ColorOutput "2. Search for the following types of sounds:"
        Write-ColorOutput "   - Background Music: Search for 'synthwave' or 'retrowave'"
        Write-ColorOutput "   - Engine Sound: Search for 'car engine' or 'race car'"
        Write-ColorOutput "   - Brake Sound: Search for 'tire screech' or 'car brake'"
        Write-ColorOutput "   - Traffic Sound: Search for 'traffic' or 'highway'"
        Write-ColorOutput "3. Download MP3 files and save them with these exact names:"
        Write-ColorOutput "   - music.mp3 - For background music"
        Write-ColorOutput "   - engine.mp3 - For car engine sounds"
        Write-ColorOutput "   - brake.mp3 - For brake sound effects"
        Write-ColorOutput "   - traffic.mp3 - For ambient traffic noise"
        Write-ColorOutput "4. Place all files in the public/audio directory"
    }
}

# Offer direct links to recommended files
$openLinks = Read-Host "`nWould you like me to open direct links to recommended audio files? (y/n)"
if ($openLinks -eq "y") {
    Write-ColorOutput "`nOpening browser links to recommended Pixabay audio files..." "Yellow"
    Write-ColorOutput "For each file, click 'Download' on the Pixabay page and save with the correct name."
    
    # Background Music
    Write-ColorOutput "`nBackground Music Options (save as 'music.mp3'):" "Magenta"
    $musicLinks = @(
        "https://pixabay.com/music/synthwave-retrofuture-electronic-cyberpunk-synthwave-120153/",
        "https://pixabay.com/music/synthwave-arcade-dreams-gaming-music-160936/",
        "https://pixabay.com/music/synthwave-speed-108185/",
        "https://pixabay.com/music/synthwave-retrowave-cruise-142819/"
    )
    
    $openMusic = Read-Host "Open background music links? (y/n)"
    if ($openMusic -eq "y") {
        foreach ($link in $musicLinks) {
            Start-Process $link
            Start-Sleep -Seconds 1  # Small delay between opening tabs
        }
    }
    
    # Engine Sound
    Write-ColorOutput "`nEngine Sound Options (save as 'engine.mp3'):" "Magenta"
    $engineLinks = @(
        "https://pixabay.com/sound-effects/race-car-engine-96774/",
        "https://pixabay.com/sound-effects/sportscar-engine-revving-6809/",
        "https://pixabay.com/sound-effects/engine-start-and-rev-6108/",
        "https://pixabay.com/sound-effects/car-engine-driving-loop-6963/"
    )
    
    $openEngine = Read-Host "Open engine sound links? (y/n)"
    if ($openEngine -eq "y") {
        foreach ($link in $engineLinks) {
            Start-Process $link
            Start-Sleep -Seconds 1
        }
    }
    
    # Brake Sound
    Write-ColorOutput "`nBrake Sound Options (save as 'brake.mp3'):" "Magenta"
    $brakeLinks = @(
        "https://pixabay.com/sound-effects/car-tire-squeal-1-6345/",
        "https://pixabay.com/sound-effects/drift-skid-103352/",
        "https://pixabay.com/sound-effects/car-skid-6261/",
        "https://pixabay.com/sound-effects/tire-screech-75761/"
    )
    
    $openBrake = Read-Host "Open brake sound links? (y/n)"
    if ($openBrake -eq "y") {
        foreach ($link in $brakeLinks) {
            Start-Process $link
            Start-Sleep -Seconds 1
        }
    }
    
    # Traffic Sound
    Write-ColorOutput "`nTraffic Sound Options (save as 'traffic.mp3'):" "Magenta"
    $trafficLinks = @(
        "https://pixabay.com/sound-effects/car-passing-by-6109/",
        "https://pixabay.com/sound-effects/car-driving-traffic-12634/",
        "https://pixabay.com/sound-effects/highway-traffic-106183/",
        "https://pixabay.com/sound-effects/cars-passing-6108/"
    )
    
    $openTraffic = Read-Host "Open traffic sound links? (y/n)"
    if ($openTraffic -eq "y") {
        foreach ($link in $trafficLinks) {
            Start-Process $link
            Start-Sleep -Seconds 1
        }
    }
}

# Offer to test audio files
$testPage = Join-Path $PSScriptRoot "public\test-audio.html"
if (Test-Path $testPage) {
    $openTest = Read-Host "`nWould you like to test your audio files now? (y/n)"
    if ($openTest -eq "y") {
        Write-ColorOutput "Opening audio test page in your browser..." "Yellow"
        Start-Process $testPage
    }
}

Write-ColorOutput "`nAudio setup is complete!" "Green"
Write-ColorOutput "- Empty placeholder files have been created"
Write-ColorOutput "- Replace them with real audio files from Pixabay for a better experience"
Write-ColorOutput "- Run the game to see how it works with the audio files"
Write-ColorOutput "- Test your audio anytime by opening: public/test-audio.html"

Write-ColorOutput "`nEnjoy the game!" "Cyan"
