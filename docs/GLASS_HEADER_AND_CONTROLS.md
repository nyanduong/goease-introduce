> Header appearance and selection motion have been superseded by [PAPER_HEADER.md](PAPER_HEADER.md). The shared control treatments below remain in use.

# Floating glass header and unified controls

## Direction
A floating, dark jade glass capsule follows the user's visual reference, with a thin illuminated rim, cream GoEase branding, icon-and-label navigation, and a brass primary action. The site remains cream/light. All existing anchors, official assets, pre-release messaging and both platform colors remain.

## Implementation
- `dist/controls.css` owns the shared control tokens and final header/interaction styling. The fixed header is 70 px on desktop and 66 px on mobile, separated from the top edge. Navigation fits a single row; the release CTA and icons are reduced at intermediate widths, with a separate glass menu below 860 px.
- `dist/gooey-nav.js` adapts React Bits GooeyNav's cubic travel easing, Bezier drop planning and selected-pill transfer. Ten restrained droplets merge through an SVG filter instead of another continuously running GPU canvas. The effect runs only while changing the active item, follows semantic `aria-current` updates, and settles immediately with global pause, reduced motion or a hidden tab. Keyboard focus remains native, with optional arrow/Home/End movement.
- Icons and translated labels are separate nodes, so switching Vietnamese/English preserves all icons.
- Primary actions share brass gradients, pill radius, specular light and pressed/hover feedback. App Store/Google Play retain their distinct platform palettes. Circular carousel/close controls, destination cards, invitation link, secondary text links, social action links, playback controls and FAQ rows now share jade/paper surfaces, brass accents and timing tokens. The device preview retains its app-reference styling.
- Specular shader corner geometry reads each control's actual CSS radius, including capsules and circles.

Source: https://reactbits.dev/components/gooey-nav and https://reactbits.dev/r/GooeyNav-JS-CSS.json, accessed 2026-10-16. David Haz copyright and MIT + Commons Clause notice retained in `dist/vendor/react-bits-LICENSE.md`.

## Verification
Production build, static contracts, syntax checks, 8 existing motion/route tests and whitespace checks pass. Chrome responsive checks at 1920x855, 1366x768, 900x768 and 390x844: no horizontal overflow, header children fit, icons preserved through language changes, navigation reaches the requested sections, mobile menu closes after selecting Download, Escape restores menu-button focus, active liquid surface produces 12 shapes in transit and settles to one, global pause removes the goo filter and settles immediately, FAQ opens, Android dialog retains correct platform copy and its updated confirm button closes it. These are desktop Chrome responsive checks, not physical mobile hardware tests.
