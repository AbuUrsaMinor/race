### The short version

“Fake-3D” racers such as **Pole Position, Out Run, Hang-On, Road Rash** and the SNES “Mode 7” titles do ***not*** draw a polygonal track.
Instead they:

1. **Store the track as a 1-D list of short segments** (length ≈ 1–5 m).
   Each segment records: road width, curvature, grade (hill), and which sprite decorations sit at its left & right edges. ([Lexaloffle][1])

2. **Project those segments one scan-line (or small stack of scan-lines) at a time from far to near**.
   For every screen-y row you:

   ```text
   z      += dz                 ; walk forward along the centre-line  
   scale  = 1 / z               ; perspective factor (cheap reciprocal table)  
   screenY = horizon - (cameraHeight * scale)  
   halfW  = roadWidth * scale / 2  
   screenX = centre + lateralOffset        ; accumulated curvature shift
   drawQuad( roadTexture, screenX±halfW, screenY ) ; paint one horizontal strip
   ```

   Because you always over-paint nearer strips, the road hides itself correctly (Painter’s algorithm) and you never need a depth buffer. ([Game Development Stack Exchange][2])

3. **Add curvature and banking** simply by adding a small Δx to `lateralOffset` every time you step forward, and slopes by adding Δy to `horizon`.
   This costs just a few integer adds per line.

4. **Overlay eye-candy** (road stripes, roadside sprites, rival cars) with the same depth-scaled lookup tables the road uses, so everything shares one cheap pipeline.

---

### Why this worked on 1980--90 s hardware

| Trick                                       | What the arcade board actually did                                                                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Per-scan-line zoom & X-scroll registers** | SEGA’s “Super-Scaler” boards let the game feed a new horizontal zoom factor and X offset *every line*. Out Run used them to stretch/narrow each strip and to shove the whole image sideways on curves. ([WIRED][3]) |
| **ROM look-up tables**                      | 256-entry tables held `1/z`, `roadWidth/z`, coloured stripe patterns, etc., so no divides or multiplies were needed inside the line loop.                                                                           |
| **Line buffer reuse**                       | Because the road is a single repeating texture, many machines just drew the same cached 256-pixel row repeatedly at different scales, saving bandwidth.                                                             |
| **Sprite hardware**                         | Trees, signs and other cars were ordinary sprites that the video-ASIC could scale independently; they never “know” about the road at all.                                                                           |

The SNES achieved a similar result in software-controlled mode 7: the background layer can be rotated and scaled each scan-line, so programmers stepped the affine matrix to mimic the above projection and fed a new matrix every line. ([Wikipedia][4])

---

### Putting it all together (conceptual pseudocode)

```pseudo
const SEGMENT = 1.0      // metres between samples
for screenY = horizonRow downto bottomRow
    z        += SEGMENT
    scale     = invTable[z]           // 1/z lookup
    roadHalfW = roadWidth * scale
    curveX   += curvature[z] * scale  // accumulate bend
    yScreen   = horizonRow - cameraH * scale + elevation[z] * scale
    drawHorizontalQuad(roadTex,          // paint the lane
                       curveX-roadHalfW, curveX+roadHalfW,
                       yScreen, yScreen+stripHeight)
end
renderSprites()  // scaled using the same invTable[]
```

Because every operation is an add or a table lookup, the inner loop fits inside the tight timing budget of a 68000 + line interrupt. That is why these games could hit 30–60 fps years before full 3-D hardware existed.

---

### Key take-aways

* **Illusion, not geometry** – the road is just a stack of scaled quads drawn on a 2-D frame-buffer.
* **One-dimensional track data** keeps memory tiny and lets designers script curves & hills easily.
* **Hardware assists (line-scroll, sprite scaling)** turn that algorithm into something fast enough for 1980s silicon.
* When real 3-D accelerator boards (Virtua Racing, Ridge Racer) finally arrived, the whole pipeline was replaced by true polygons – but the “segment list + draw from far to near” idea survives today in modern racing games’ LOD systems.

Now, the next time you see those stretching scan-lines climbing a hill in Out Run, you’ll know they’re just clever math, lookup tables, and a lot of very fast raster tricks.

[1]: https://www.lexaloffle.com/bbs/?tid=35767&utm_source=chatgpt.com "Creating a pseudo 3D racer - Lexaloffle Games"
[2]: https://gamedev.stackexchange.com/questions/49626/best-technique-to-create-oldschool-fake-3d-racing-game?utm_source=chatgpt.com "Best technique to create oldschool (fake 3D) racing game?"
[3]: https://www.wired.com/story/out-run-video-game-design?utm_source=chatgpt.com "How Out Run changed video games forever"
[4]: https://en.wikipedia.org/wiki/Mode_7?utm_source=chatgpt.com "Mode 7 - Wikipedia"
