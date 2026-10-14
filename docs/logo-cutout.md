# Logo cutout

- Input: `dist/assets/goease-logo.png`, official logo supplied by the user.
- Output used by the download panel: `dist/assets/goease-logo-cutout.png`.
- Tool: built-in ImageGen, transparent background enabled.
- Validation: inspected on the teal website; PNG alpha ranges from 0 to 255, with transparent outer and inner negative space. Original source asset is preserved.

## Prompt used for the selected output

Use case: background-extraction. Edit target: the supplied official GoEase circular logo. Remove ONLY every white or cream background pixel, outside AND inside the thin circular ring, including all white negative spaces between the G and swoosh. Output a genuinely transparent PNG with alpha, containing only the exact original teal/cyan and yellow/orange colored logo strokes, circular ring, and paper airplane. Preserve original geometry, proportions, gradients, clean edges, relative positions, full circular border, centered square composition. No redesign, no text, no glow, no shadow, no additional color artifacts. This is a faithful background removal for placement on a dark teal website.
