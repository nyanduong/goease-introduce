# Flux Lines background

`dist/flux-background.js` adapts the original React Bits FluxLines shader and value-noise field to the static native site. Source retrieved 2026-10-16 from https://reactbits.dev/r/FluxLines-JS-CSS.json. David Haz copyright / MIT + Commons Clause notice remains in `dist/vendor/react-bits-LICENSE.md`.

One transparent, fixed WebGL2 canvas sits behind page content, with light-mode jade/brass colors, 35% ribbon opacity and a centre-fading mask. Existing opaque sections/cards and the opaque header strip cover it. The decorative layer has no pointer events and no semantic content. Fine-pointer interaction gently distorts the original shader field; click swirls are disabled. The amplified palette, cursor brightness boost and stronger distortion were reverted at the user's request. The shared page background and phone interactions remain intact.

Rendering is capped at 30 fps desktop / 24 fps mobile, DPR <=1, maximum 1280px buffer width and 900px height. Global pause, reduced motion, hidden pages and open dialogs stop the loop. Unsupported/lost WebGL keeps the static CSS gradient background; context loss does not keep scheduling frames. No additional dependency or renderer bundle.

Checks: production static build and syntax validation, existing 8 route/motion tests. Chrome checks cover actual WebGL2 rendering, buffer dimensions, pause/resume, mobile responsive layout and no horizontal overflow. These are responsive desktop-browser checks, not physical mobile performance measurements.
