# Audio Integration Guide for Race Game

## Required Sound Files

Your racing game needs the following audio files to enhance the gaming experience:

1. **Background Music (`music.mp3`)**
   - Recommended: Synthwave/retrowave style music with 80s arcade feel
   - Duration: 2-3 minutes with good loop points
   - [Search Pixabay for "synthwave" or "retrowave"](https://pixabay.com/music/search/synthwave/)
   - Suggested: "Retrofuture Cyberpunk Synthwave" or similar tracks

2. **Engine Sound (`engine.mp3`)**
   - Racing car engine revving sound
   - Duration: 5-10 seconds, good for looping
   - [Search Pixabay for "car engine" or "race car"](https://pixabay.com/sound-effects/search/car%20engine/)
   - Suggested: "Race Car Engine" or "Sports Car Revving"

3. **Brake Sound (`brake.mp3`)**
   - Tire screeching effect
   - Duration: 1-3 seconds
   - [Search Pixabay for "tire screech" or "car brake"](https://pixabay.com/sound-effects/search/tire%20screech/)
   - Suggested: "Car Tire Squeal" or similar

4. **Traffic Sound (`traffic.mp3`)**
   - Ambient traffic noise, passing cars
   - Duration: 10-30 seconds
   - [Search Pixabay for "traffic" or "highway"](https://pixabay.com/sound-effects/search/traffic/)
   - Suggested: "Car Driving Traffic" or similar

## Download Instructions

1. Visit [Pixabay Sound Effects](https://pixabay.com/sound-effects/) or [Pixabay Music](https://pixabay.com/music/)
2. Use the search terms suggested above
3. For each sound:
   - Click the sound you want to use
   - Click the "Download" button
   - Select the appropriate quality (MP3 128kbps is usually sufficient)
   - Save the file with the correct name (music.mp3, engine.mp3, etc.)

## File Placement

Place all downloaded audio files in the following directory:
```
/public/audio/
```

So your file structure should look like:
```
/public/audio/music.mp3
/public/audio/engine.mp3  
/public/audio/brake.mp3
/public/audio/traffic.mp3
```

## Audio Format Recommendations

- **Format:** MP3
- **Sample Rate:** 44.1 kHz
- **Bit Rate:** 128-256 kbps (balance between quality and file size)
- **Channels:** Stereo for music, mono acceptable for sound effects

## Testing Your Audio

After placing the files in the correct directory, run the game and check:

1. Background music plays automatically when game starts
2. Brake sound plays when brake is pressed
3. Engine sound plays during acceleration
4. Traffic sounds play during gameplay

## Troubleshooting

If audio doesn't play:
- Check browser console for any errors
- Make sure filenames are correct and match exactly
- Verify that files are in the correct location
- Try different audio formats if needed (OGG as alternative)
- Check that your browser's audio is not muted

Note: The game includes a fallback system that generates synthetic sound if audio files are not found, but real audio files provide a much better gaming experience.
