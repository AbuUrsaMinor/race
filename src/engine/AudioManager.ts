// AudioManager.ts - Handles all audio for the game
export class AudioManager {
    private context: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;
    private backgroundMusic: AudioBufferSourceNode | null = null;
    // Removed unused variable: // Removed unused variable: // Removed unused variable: isInitialized
    private isSoundsGenerated = false;
    private isSoundsLoading = false;

    // Production paths (deployed on GitHub Pages)
    private prodAudioFiles = {
        music: '/outrun-racer/audio/music.mp3',
        engine: '/outrun-racer/audio/engine.mp3',
        brake: '/outrun-racer/audio/brake.mp3',
        traffic: '/outrun-racer/audio/traffic.mp3',
    };

    // Local development paths
    private devAudioFiles = {
        music: '/audio/music.mp3',
        engine: '/audio/engine.mp3',
        brake: '/audio/brake.mp3',
        traffic: '/audio/traffic.mp3',
    };

    // Current audio files paths - we'll try both prod and dev
    private audioFiles = this.prodAudioFiles;

    constructor() {
        this.initializeAudio();
    }

    private async initializeAudio() {
        try {
            // Use proper type casting for webkitAudioContext
            const AudioContextClass = window.AudioContext ||
                ((window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
            this.context = new AudioContextClass();

            // Create gain nodes for volume control
            this.musicGain = this.context.createGain();
            this.sfxGain = this.context.createGain();

            this.musicGain.connect(this.context.destination);
            this.sfxGain.connect(this.context.destination); this.musicGain.gain.value = 0.3;
            this.sfxGain.gain.value = 0.5;

            // Try to load audio files first, fall back to generated sounds
            try {
                await this.loadSoundFiles();
            } catch (error) {
                console.warn('Failed to load audio files, using synthesized sounds instead:', error);
                await this.generateSounds();
            }

            // Audio initialization completed
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    private async loadSoundFiles() {
        if (!this.context || this.isSoundsLoading) return;

        this.isSoundsLoading = true;

        try {
            // Try to load each sound file with production paths first, then dev paths as fallback
            const soundNames = Object.keys(this.audioFiles);
            const loadResults = await Promise.all(
                soundNames.map(async (name) => {
                    try {
                        // Try production path first
                        const prodPath = this.audioFiles[name as keyof typeof this.audioFiles];
                        try {
                            console.log(`Attempting to load ${name} from: ${prodPath}`);
                            const response = await fetch(prodPath);
                            if (!response.ok) throw new Error(`Failed to load ${prodPath}`);

                            const arrayBuffer = await response.arrayBuffer();
                            if (!this.context) throw new Error('Audio context not available');

                            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                            this.sounds.set(name, audioBuffer);
                            console.log(`✓ Loaded audio: ${name} (production path)`);
                            return true;
                        } catch (prodError) {
                            // Handle error properly with type checking
                            const errorMessage = prodError instanceof Error ? prodError.message : String(prodError);
                            console.warn(`Could not load from production path: ${errorMessage}`);

                            // Try development path as fallback
                            const devPath = this.devAudioFiles[name as keyof typeof this.devAudioFiles];
                            console.log(`Attempting fallback load ${name} from: ${devPath}`);
                            const response = await fetch(devPath);
                            if (!response.ok) throw new Error(`Failed to load ${devPath}`);

                            const arrayBuffer = await response.arrayBuffer();
                            if (!this.context) throw new Error('Audio context not available');

                            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                            this.sounds.set(name, audioBuffer); console.log(`✓ Loaded audio: ${name} (development path)`);
                            return true;
                        }
                    } catch (error) {
                        console.warn(`Failed to load audio file ${name} from any path:`, error);
                        return false;
                    }
                })
            );

            const allSucceeded = loadResults.every(result => result === true);

            if (!allSucceeded) {
                console.warn('Some audio files failed to load, falling back to synthesized sounds');
                throw new Error('Some audio files failed to load');
            }

            this.isSoundsGenerated = true;
            this.isSoundsLoading = false;
            console.log('All audio files loaded successfully');
        } catch (error) {
            this.isSoundsLoading = false;
            throw error;
        }
    }

    private async generateSounds() {
        if (!this.context || this.isSoundsGenerated) return;

        console.log('Generating synthesized audio...');

        // Generate brake sound (filtered white noise with better dynamics)
        const brakeBuffer = this.context.createBuffer(1, this.context.sampleRate * 0.8, this.context.sampleRate);
        const brakeData = brakeBuffer.getChannelData(0);

        for (let i = 0; i < brakeData.length; i++) {
            const t = i / this.context.sampleRate;
            // Add some frequency variation for more realistic tire screech
            const amt = Math.max(0, 1 - t * 2); // Envelope
            brakeData[i] = ((Math.random() * 2 - 1) * 0.5 + Math.sin(t * 3000) * 0.5) * Math.exp(-i / (this.context.sampleRate * 0.2)) * amt;
        }

        this.sounds.set('brake', brakeBuffer);

        // Generate engine sound (more complex harmonics for richer sound)
        const engineBuffer = this.context.createBuffer(1, this.context.sampleRate * 0.3, this.context.sampleRate);
        const engineData = engineBuffer.getChannelData(0);

        for (let i = 0; i < engineData.length; i++) {
            const t = i / this.context.sampleRate;
            const baseFreq = 110; // Lower base frequency for deeper engine sound

            // Multiple harmonics for richer sound
            const harmonic1 = Math.sin(2 * Math.PI * baseFreq * t);
            const harmonic2 = Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.5;
            const harmonic3 = Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.25;

            // Add some random noise for combustion effect
            const noise = (Math.random() * 2 - 1) * 0.1;

            // Combine with slight RPM variation
            const rpm = 1 + Math.sin(t * 8) * 0.1;

            engineData[i] = (harmonic1 + harmonic2 + harmonic3 + noise) * 0.3 * Math.exp(-t * 3) * rpm;
        }

        this.sounds.set('engine', engineBuffer);

        // Generate more complex background music (80s synth style)
        const musicBuffer = this.context.createBuffer(2, this.context.sampleRate * 8, this.context.sampleRate);
        const leftChannel = musicBuffer.getChannelData(0);
        const rightChannel = musicBuffer.getChannelData(1);

        // Minor pentatonic scale for that 80s game vibe
        const baseNotes = [220, 261.63, 329.63, 392.00, 440]; // A, C, E, G, A
        // Create a bassline, melody and drums
        for (let i = 0; i < leftChannel.length; i++) {
            const t = i / this.context.sampleRate;
            // const bar = Math.floor(t * 2) % 4; // 4 bar pattern
            const beat = t * 8 % 1; // 8th note timing

            // Bass (sequenced pattern)
            const bassPattern = [0, 0, 2, 0, 1, 0, 3, 2];
            const bassIndex = Math.floor(t * 8) % bassPattern.length;
            const bassNote = baseNotes[bassPattern[bassIndex]] / 2; // Octave lower
            const bass = Math.sin(2 * Math.PI * bassNote * t) * 0.2 * (1 - beat * 0.7);

            // Lead synth (arpeggio)
            const leadPattern = [4, 3, 2, 3, 4, 2, 3, 1];
            const leadIndex = Math.floor(t * 4) % leadPattern.length;
            const leadNote = baseNotes[leadPattern[leadIndex]];
            const lead = Math.sin(2 * Math.PI * leadNote * t) * 0.08 * Math.pow(beat, 0.5);

            // Percussion (kick and hi-hat)
            let drums = 0;
            if (beat < 0.1) { // Kick drum on the beat
                drums = Math.sin(2 * Math.PI * 60 * beat * 10) * (1 - beat * 10) * 0.2;
            }
            if (beat > 0.45 && beat < 0.55) { // Hi-hat on the offbeat                drums = (Math.random() * 2 - 1) * 0.05 * (1 - (beat - 0.5) * 10);
            }

            // Combine and apply effects
            leftChannel[i] = bass + lead + drums;
            rightChannel[i] = bass + lead * 0.8 + drums * 1.2; // Stereo effect
        }

        this.sounds.set('music', musicBuffer);

        // Generate traffic sound (low rumble with occasional whooshes)
        const trafficBuffer = this.context.createBuffer(1, this.context.sampleRate * 5, this.context.sampleRate);
        const trafficData = trafficBuffer.getChannelData(0);

        for (let i = 0; i < trafficData.length; i++) {
            const t = i / this.context.sampleRate;

            // Base ambient road noise (filtered noise)
            const baseNoise = (Math.random() * 2 - 1) * 0.03;

            // Occasional car passing (whoosh effect)
            let carPassing = 0;
            const carPassingTimes = [0.5, 1.5, 2.3, 3.2, 4.1]; // Times when cars pass

            for (const passTime of carPassingTimes) {
                // Create a whoosh effect centered around each passing time
                const timeDiff = Math.abs(t - passTime);
                if (timeDiff < 0.3) {
                    // Doppler-like effect - frequency shifts as car passes
                    const phase = (timeDiff - 0.15) * 20;
                    const amplitude = Math.max(0, 0.15 - timeDiff) * 0.8;
                    carPassing += Math.sin(phase * 50 + Math.sin(phase * 2) * 3) * amplitude;
                }
            }

            trafficData[i] = baseNoise + carPassing;
        }

        this.sounds.set('traffic', trafficBuffer);

        this.isSoundsGenerated = true;
        console.log('Synthesized audio generated successfully');
    }

    public async ensureAudioContext() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    public async loadSound(soundName: string, url: string): Promise<boolean> {
        if (!this.context) return false;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

            this.sounds.set(soundName, audioBuffer);
            return true;
        } catch (error) {
            console.warn(`Failed to load sound ${soundName} from ${url}:`, error);
            return false;
        }
    }

    public playSound(soundName: string, loop: boolean = false) {
        if (!this.context || !this.sounds.has(soundName)) {
            console.warn(`Attempted to play sound ${soundName}, but it's not available.`);
            return null;
        }

        const buffer = this.sounds.get(soundName)!;
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        if (soundName === 'music') {
            source.connect(this.musicGain!);
        } else {
            source.connect(this.sfxGain!);
        }

        source.start();
        return source;
    }

    public playEngineSound(rpm: number): AudioBufferSourceNode | null {
        if (!this.context || !this.sounds.has('engine')) {
            return null;
        }

        // Scale RPM factor between 0.8 and 1.5 to simulate different engine pitches
        const pitchFactor = 0.8 + Math.min(rpm, 1) * 0.7; const source = this.playSound('engine', true);
        if (source) {
            source.playbackRate.value = pitchFactor;
        }

        return source;
    }

    public playBrakeSound() {
        return this.playSound('brake', false);
    }

    public playTrafficSound() {
        return this.playSound('traffic', true);
    }

    public playBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }

        this.backgroundMusic = this.playSound('music', true);
    }

    public stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }
    }

    public setMusicVolume(volume: number) {
        if (this.musicGain) {
            this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    public setSfxVolume(volume: number) {
        if (this.sfxGain) {
            this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    public getAvailableSounds(): string[] {
        return Array.from(this.sounds.keys());
    }

    public getAudioContext(): AudioContext | null {
        return this.context;
    }
}
