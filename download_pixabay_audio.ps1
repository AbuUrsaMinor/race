# Download Pixabay Audio Files for Outrun Racer
#
# This script will help you download audio files from Pixabay for your racing game
# It will open web links to recommended files and guide you through the process

Write-Host "===== Outrun Racer Audio Downloader =====" -ForegroundColor Cyan
Write-Host "This script will help you download audio files from Pixabay."
Write-Host "You will need to manually download each file from Pixabay and save it properly."
Write-Host ""

# Create audio directory if it doesn't exist
$audioDir = Join-Path $PSScriptRoot "public\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
    Write-Host "Created audio directory: $audioDir" -ForegroundColor Green
}

# Function to open a URL
function Open-PixabayLink {
    param(
        [string]$url,
        [string]$description
    )
    
    Write-Host "Opening browser to download: $description" -ForegroundColor Yellow
    Start-Process $url
    
    # Give user time to download the file
    Write-Host "After downloading from Pixabay:"
    Write-Host "1. Click the 'Download' button on the Pixabay page"
    Write-Host "2. Choose MP3 format (128kbps is fine)"
    Write-Host "3. Save the file to the public/audio directory with the correct name"
    
    $response = Read-Host "Press Enter when you've downloaded the file (or type 'skip' to skip)"
    return $response -ne "skip"
}

# ----------------------
# 1. Background Music
# ----------------------
Write-Host "`n== STEP 1: Background Music ==" -ForegroundColor Magenta
Write-Host "You need a synthwave/retrowave style music track for the game background."
$musicOptions = @(
    @{url = "https://pixabay.com/music/synthwave-retrofuture-electronic-cyberpunk-synthwave-120153/"; desc = "RetroFuture Synthwave by AlexiAction"; },
    @{url = "https://pixabay.com/music/synthwave-arcade-dreams-gaming-music-160936/"; desc = "Arcade Dreams by GoodBMusic"; },
    @{url = "https://pixabay.com/music/synthwave-speed-108185/"; desc = "Speed Synthwave by FreeGroove"; },
    @{url = "https://pixabay.com/music/synthwave-retrowave-cruise-142819/"; desc = "Retrowave Cruise by Lexin_Music"; }
)

Write-Host "Choose one of these recommended tracks:"
for ($i = 0; $i -lt $musicOptions.Count; $i++) {
    Write-Host "[$($i+1)] $($musicOptions[$i].desc)"
}

$choice = Read-Host "Enter your choice (1-4) or press Enter for option 1"
if (-not $choice) { $choice = 1 } else { $choice = [int]$choice }

if ($choice -ge 1 -and $choice -le $musicOptions.Count) {
    $selected = $musicOptions[$choice-1]
    $downloaded = Open-PixabayLink -url $selected.url -description $selected.desc
    
    if ($downloaded) {
        Write-Host "Don't forget to save the file as 'music.mp3' in the public/audio directory" -ForegroundColor Green
    }
}

# ----------------------
# 2. Engine Sound
# ----------------------
Write-Host "`n== STEP 2: Engine Sound ==" -ForegroundColor Magenta
Write-Host "You need a racing car engine sound that will be used during gameplay."
$engineOptions = @(
    @{url = "https://pixabay.com/sound-effects/race-car-engine-96774/"; desc = "Race Car Engine"; },
    @{url = "https://pixabay.com/sound-effects/sportscar-engine-revving-6809/"; desc = "Sports Car Revving"; },
    @{url = "https://pixabay.com/sound-effects/engine-start-and-rev-6108/"; desc = "Engine Start And Rev"; },
    @{url = "https://pixabay.com/sound-effects/car-engine-driving-loop-6963/"; desc = "Car Engine Driving Loop"; }
)

Write-Host "Choose one of these recommended engine sounds:"
for ($i = 0; $i -lt $engineOptions.Count; $i++) {
    Write-Host "[$($i+1)] $($engineOptions[$i].desc)"
}

$choice = Read-Host "Enter your choice (1-4) or press Enter for option 1"
if (-not $choice) { $choice = 1 } else { $choice = [int]$choice }

if ($choice -ge 1 -and $choice -le $engineOptions.Count) {
    $selected = $engineOptions[$choice-1]
    $downloaded = Open-PixabayLink -url $selected.url -description $selected.desc
    
    if ($downloaded) {
        Write-Host "Don't forget to save the file as 'engine.mp3' in the public/audio directory" -ForegroundColor Green
    }
}

# ----------------------
# 3. Brake Sound
# ----------------------
Write-Host "`n== STEP 3: Brake Sound ==" -ForegroundColor Magenta
Write-Host "You need a tire screeching sound effect for when the player brakes."
$brakeOptions = @(
    @{url = "https://pixabay.com/sound-effects/car-tire-squeal-1-6345/"; desc = "Car Tire Squeal"; },
    @{url = "https://pixabay.com/sound-effects/drift-skid-103352/"; desc = "Drift Skid"; },
    @{url = "https://pixabay.com/sound-effects/car-skid-6261/"; desc = "Car Skid"; },
    @{url = "https://pixabay.com/sound-effects/tire-screech-75761/"; desc = "Tire Screech"; }
)

Write-Host "Choose one of these recommended brake sounds:"
for ($i = 0; $i -lt $brakeOptions.Count; $i++) {
    Write-Host "[$($i+1)] $($brakeOptions[$i].desc)"
}

$choice = Read-Host "Enter your choice (1-4) or press Enter for option 1"
if (-not $choice) { $choice = 1 } else { $choice = [int]$choice }

if ($choice -ge 1 -and $choice -le $brakeOptions.Count) {
    $selected = $brakeOptions[$choice-1]
    $downloaded = Open-PixabayLink -url $selected.url -description $selected.desc
    
    if ($downloaded) {
        Write-Host "Don't forget to save the file as 'brake.mp3' in the public/audio directory" -ForegroundColor Green
    }
}

# ----------------------
# 4. Traffic Sound
# ----------------------
Write-Host "`n== STEP 4: Traffic Sound ==" -ForegroundColor Magenta
Write-Host "You need an ambient traffic sound for background atmosphere."
$trafficOptions = @(
    @{url = "https://pixabay.com/sound-effects/car-passing-by-6109/"; desc = "Car Passing By"; },
    @{url = "https://pixabay.com/sound-effects/car-driving-traffic-12634/"; desc = "Car Driving Traffic"; },
    @{url = "https://pixabay.com/sound-effects/highway-traffic-106183/"; desc = "Highway Traffic"; },
    @{url = "https://pixabay.com/sound-effects/cars-passing-6108/"; desc = "Cars Passing"; }
)

Write-Host "Choose one of these recommended traffic sounds:"
for ($i = 0; $i -lt $trafficOptions.Count; $i++) {
    Write-Host "[$($i+1)] $($trafficOptions[$i].desc)"
}

$choice = Read-Host "Enter your choice (1-4) or press Enter for option 1"
if (-not $choice) { $choice = 1 } else { $choice = [int]$choice }

if ($choice -ge 1 -and $choice -le $trafficOptions.Count) {
    $selected = $trafficOptions[$choice-1]
    $downloaded = Open-PixabayLink -url $selected.url -description $selected.desc
    
    if ($downloaded) {
        Write-Host "Don't forget to save the file as 'traffic.mp3' in the public/audio directory" -ForegroundColor Green
    }
}

# ----------------------
# Verification
# ----------------------
Write-Host "`n== VERIFYING DOWNLOADED AUDIO FILES ==" -ForegroundColor Magenta

$requiredFiles = @("music.mp3", "engine.mp3", "brake.mp3", "traffic.mp3")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $audioDir $file
    if (-not (Test-Path $filePath)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "The following files are still missing:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "- $file" -ForegroundColor Red
    }
    
    Write-Host "`nPlease make sure to download all required audio files and save them with the correct names."
    Write-Host "Remember to save the files directly in the public/audio directory."
} else {
    Write-Host "All required audio files have been found! Great work!" -ForegroundColor Green
}

# ----------------------
# Open Test Page
# ----------------------
Write-Host "`n== TESTING YOUR AUDIO FILES ==" -ForegroundColor Magenta
$testPage = Join-Path $PSScriptRoot "public\test-audio.html"

if (Test-Path $testPage) {
    $openTest = Read-Host "Would you like to test your audio files now? (y/n)"
    if ($openTest -eq "y") {
        Write-Host "Opening audio test page in your browser..." -ForegroundColor Yellow
        Start-Process $testPage
    }
}

Write-Host "`nThank you for setting up the audio files for Outrun Racer!" -ForegroundColor Cyan
Write-Host "You can always test your audio later by opening: public/test-audio.html"
