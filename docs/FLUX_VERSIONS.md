# Flux Lines versions

The user named the gentle density experiment **v1** and authorized returning to the preceding effect by saying **"bỏ v1"**.

Active version: `v1`, selected by `FLUX_VERSION` in `dist/flux-background.js`.

| Setting | Previous | v1 |
| --- | --- | --- |
| Scale | 1.4 | 1.3 |

The shader divides its coordinates by scale. This small reduction places slightly more ribbon detail within the same area. Color, opacity (0.35), thickness, glow, speed, interaction and CSS mask stay exactly as before v1. No extra canvas or rendering pass is added.

To process **"bỏ v1"**: change `FLUX_VERSION` to `'previous'`, update the `flux-background.js` query version in `dist/index.html`, and run the build. This restores the precise earlier scale of 1.4 without reverting phone interactions or unrelated site work. Both presets remain in the source.
