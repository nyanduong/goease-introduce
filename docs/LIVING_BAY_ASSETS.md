# Living Ha Long Bay hero

Generated with the built-in image_gen tool, with transparent alpha preserved. Assets are artistic depictions inspired by Ha Long Bay, not documentary photographs. Optimized to WebP for the static website.

Files: `dist/assets/hero-bay-natural.webp`, `dist/assets/hero-junk-boat.webp`, `dist/assets/hero-cumulus.webp`.

`src/hero-bay.js` composites the terrain, animated water, three cloud layers, moving boat, reflection and stern wake in the aircraft WebGL renderer. All animation uses the shared clock and respects pause, hidden/offscreen, dialog and reduced-motion states. The terrain uses a photographic raster layer, not a 3D terrain simulation. Three crossing wave trains distort foreground water and mountain reflections, with moving broken sunlight glints and a stable alpha edge. Boat reflection has separate ripple distortion, a wider stern wake and expanding bow ripples. Displacement is limited to foreground water; rocks remain stable.

Boat moves slowly in one direction across open foreground water, with a small wave-driven bob and roll. Reflection and wake track its waterline. Cloud layers move at distinct speeds, with the far layers behind the mountains and a translucent foreground layer in front. Wraps happen outside the canvas or with an opacity fade.

## Final generation prompts

### bay

Edit the reference Ha Long Bay cutout into a much more photographic natural landscape for a premium Vietnam travel website. Keep a transparent cutout silhouette, an irregular softly fading water edge, and the overall central tall karst / flanking islands composition. Remove the sailing boat completely: no vessels anywhere. Replace the toy-like miniature diorama appearance with convincing actual landscape photography: geologically plausible immense weathered grey limestone cliffs, jagged eroded rock faces, distinct dense tropical canopy clinging to crevices, natural asymmetry, overlapping misty distant islands. Real daylight with subtle warm sun from upper left, cooler shaded rock, restrained saturation, genuine deep jade/turquoise sea, subtle photographic water ripples and reflections. Mountains occupy most height; open foreground water occupies bottom quarter so an independently animated small boat can travel there. No platform, no circular pedestal, no infographic, no borders, no text, no sky background, no embedded clouds, no airplane. Entire cutout comfortably inside frame, transparent sky and margins. Detailed photographic landscape, not painted, not glossy CGI. Landscape ratio 3:2.

### boat

Create one isolated authentic Vietnamese Ha Long Bay traditional wooden sailing junk boat as a photorealistic asset with genuinely transparent background. One vessel only, facing RIGHT, viewed from a moderately elevated shore viewpoint, near side visible with a little top deck. Dark weathered wooden hull, realistic deckhouse and tiny windows, two ochre rust-orange battened sails with visible fabric seams, rope rigging and spars; physically coherent construction. Warm natural daylight from upper left, shaded right side. Elegant small passenger junk, no people visible, no lettering, no logos. Boat fully visible with transparent margins. NO sea, NO water, NO reflection, NO wake, NO sky, NO scenery, NO cast shadow on backdrop. This will be animated separately on a realistic bay, so alpha silhouette must include all sails and hull cleanly. Wide landscape framing, very fine photography-like detail.

### cloud

One natural soft white cumulus cloud formation isolated on genuinely transparent background. Photorealistic atmospheric water vapour, wispy feathered translucent edges, luminous warm white sunlit top from upper left, subtle pale blue-grey self-shaded underside, organically irregular volume. Wide and relatively low, a few linked airy lobes, no cartoon outline, no solid cotton-ball CGI look, no dark storm cloud. No sky whatsoever, no blue rectangle, no landscape, no ground, no text, no shadow on a backdrop. Full cloud comfortably visible with transparent margins, realistic partial alpha around soft wisps. Designed as a drifting overlay in a photographic landscape.
