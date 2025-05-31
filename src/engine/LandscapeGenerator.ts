import type { LandscapeObject } from '../types/game';

export class LandscapeGenerator {
    private noise: number[] = [];
    private noiseLength = 1000;

    constructor() {
        this.generateNoise();
    }

    private generateNoise() {
        for (let i = 0; i < this.noiseLength; i++) {
            this.noise[i] = Math.random();
        }
    }

    private interpolatedNoise(x: number): number {
        const intX = Math.floor(x);
        const fracX = x - intX;

        const v1 = this.smoothNoise(intX);
        const v2 = this.smoothNoise(intX + 1);

        return this.interpolate(v1, v2, fracX);
    }

    private smoothNoise(x: number): number {
        const n = Math.abs(x) % this.noiseLength;
        return this.noise[n];
    }

    private interpolate(a: number, b: number, x: number): number {
        const ft = x * Math.PI;
        const f = (1 - Math.cos(ft)) * 0.5;
        return a * (1 - f) + b * f;
    }

    private perlinNoise(x: number, persistence: number, octaves: number): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.interpolatedNoise(x * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    } public generateLandscape(distance: number): LandscapeObject[] {
        const landscape: LandscapeObject[] = [];
        const spacing = 100;
        const baseDistance = Math.floor(distance / spacing) * spacing;

        // Generate mountains with more variation in appearance and density
        // Near mountains - primary mountain range
        for (let i = 0; i < 25; i++) {
            const offset = (i % 2 === 0) ? 50 : -50; // Offset for natural variation
            const x = (i - 12) * 180 + offset;
            const z = baseDistance + i * 250;
            const height = this.perlinNoise(z * 0.0015, 0.6, 4) * 350 + 200;

            landscape.push({
                type: 'mountain',
                x,
                y: height,
                z,
                sprite: null,
                scale: 1 + this.perlinNoise(z * 0.0025, 0.4, 2) * 0.6
            });
        }

        // Far mountains - secondary range for depth
        for (let i = 0; i < 15; i++) {
            const x = (i - 7) * 300 + Math.random() * 100;
            const z = baseDistance + i * 400 + 2000; // Further away
            const height = this.perlinNoise(z * 0.001, 0.5, 3) * 250 + 150;

            landscape.push({
                type: 'mountain',
                x,
                y: height,
                z,
                sprite: null,
                scale: 0.8 + this.perlinNoise(z * 0.002, 0.3, 2) * 0.4
            });
        }

        // Generate trees with clustering effect
        // Roadside trees (closer to the road)
        for (let i = 0; i < 60; i++) {
            // Trees closer to the road sides
            const side = Math.random() > 0.5 ? 1 : -1;
            const x = side * (300 + Math.random() * 200);
            const z = baseDistance + i * 100 + Math.random() * 500;
            const treeNoise = this.perlinNoise(z * 0.012, 0.6, 3);

            if (treeNoise > 0.25) {
                landscape.push({
                    type: 'tree',
                    x,
                    y: 0,
                    z,
                    sprite: null,
                    scale: 0.5 + Math.random() * 0.6
                });

                // Create tree clusters occasionally
                if (Math.random() > 0.7) {
                    for (let j = 0; j < 3; j++) {
                        landscape.push({
                            type: 'tree',
                            x: x + (Math.random() - 0.5) * 100,
                            y: 0,
                            z: z + (Math.random() - 0.5) * 100,
                            sprite: null,
                            scale: 0.3 + Math.random() * 0.4
                        });
                    }
                }
            }
        }

        // Forest trees (further from the road)
        for (let i = 0; i < 40; i++) {
            const side = Math.random() > 0.5 ? 1 : -1;
            const x = side * (500 + Math.random() * 400);
            const z = baseDistance + Math.random() * 2000;
            const treeNoise = this.perlinNoise(z * 0.01, 0.6, 3);

            if (treeNoise > 0.3) {
                // Create a forest cluster
                const clusterSize = Math.floor(Math.random() * 5) + 2;
                for (let j = 0; j < clusterSize; j++) {
                    landscape.push({
                        type: 'tree',
                        x: x + (Math.random() - 0.5) * 150,
                        y: 0,
                        z: z + (Math.random() - 0.5) * 150,
                        sprite: null,
                        scale: 0.4 + Math.random() * 0.5
                    });
                }
            }
        }

        // Generate houses with more structure - create small towns
        const townCount = Math.floor(Math.random() * 3) + 1;
        for (let town = 0; town < townCount; town++) {
            const townX = (Math.random() - 0.5) * 1000;
            const townZ = baseDistance + town * 1500 + Math.random() * 2000;
            const houseCount = Math.floor(Math.random() * 6) + 3;

            // Place houses in a small town-like formation
            for (let i = 0; i < houseCount; i++) {
                const offset = 100 + i * 80;
                const side = i % 2 === 0 ? 1 : -1;
                const x = townX + side * offset + (Math.random() - 0.5) * 50;
                const z = townZ + i * 40 + (Math.random() - 0.5) * 80;

                landscape.push({
                    type: 'house',
                    x,
                    y: 0,
                    z,
                    sprite: null,
                    scale: 0.7 + Math.random() * 0.5
                });

                // Add bushes and decorative elements around houses
                for (let j = 0; j < 3; j++) {
                    landscape.push({
                        type: 'bush',
                        x: x + (Math.random() - 0.5) * 40,
                        y: 0,
                        z: z + (Math.random() - 0.5) * 40,
                        sprite: null,
                        scale: 0.2 + Math.random() * 0.3
                    });
                }
            }
        }

        // Generate bushes and small vegetation along the roadside
        for (let i = 0; i < 60; i++) {
            const side = Math.random() > 0.5 ? 1 : -1;
            const x = side * (200 + Math.random() * 100);
            const z = baseDistance + i * 80 + Math.random() * 2000;

            landscape.push({
                type: 'bush',
                x,
                y: 0,
                z,
                sprite: null,
                scale: 0.2 + Math.random() * 0.3
            });
        }

        // Add sea elements for coastal sections
        if (Math.random() > 0.7) { // 30% chance of coastal section
            const seaSide = Math.random() > 0.5 ? 1 : -1;
            const seaDistance = baseDistance + Math.random() * 1000;

            // Create a series of sea elements to form a coastline
            for (let i = 0; i < 15; i++) {
                landscape.push({
                    type: 'sea',
                    x: seaSide * 800 + (Math.random() - 0.5) * 200,
                    y: 0,
                    z: seaDistance + i * 200 + (Math.random() - 0.5) * 100,
                    sprite: null,
                    scale: 1.5 + Math.random() * 0.5
                });
            }
        }

        return landscape;
    }
}
