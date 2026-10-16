# GoEase — Việt Nam, theo cách của bạn

15 October 2026. Local redesign only. Repository: `C:/Wed-GoEase/goease-site`; original HEAD `2d227170bc3dcf7e365330d0f4b2270ba29a1aa4`, clean working tree at discovery. No commits, pushes, deployment, remote or workflow edits.

## Product and brand

Read the current product README and MVP_EXPO_GO in `C:/GoEase/go-ease-webapp`, and the connected [project reference](https://docs.google.com/document/d/1Gw-Ya7AZdLkljLPnj6_fiTi05DxF9bKpGFo-AYz-eJM/edit). GoEase is an early travel planning project for Vietnam, initially targeting young independent travelers and students. Interests, time, group size, editable itineraries and costs form the core direction. AI integration remains planned. Neither research survey participation nor national travel statistics are product adoption. No statistics, testimonials, released AI, booking or store links will be invented.

Preserve official logo files byte-for-byte, the exact slogan **Just go. We'll plan.**, and the approved `#FFF8EF` cream from the existing styles. Light only. Existing Vietnamese/English, navigation, download availability, dialog, FAQ, scenic autoplay and Facebook capabilities remain.

## Visual audit and references

Inspected the public GoEase page in the real in-app browser at desktop and 390px mobile; before captures are in `qa/redesign`. Mobile places destination imagery roughly 600px below the top; oversized store buttons and detached postcard/stamp decorations compete with the headline. Three similar features, three phone frames and three step cards repeat the same storytelling rhythm.

Read and visually inspected [Linear](https://linear.app/), [Framer](https://www.framer.com/), [Raycast](https://www.raycast.com/) and [Notion](https://www.notion.com/). Lessons adopted: deliberate type hierarchy and aligned section edges; a single focal product demonstration; transitions that describe state changes; short, approachable explanations. Brand assets, dark palettes, customer proof and distinctive compositions are not copied.

## Creative direction

An editorial travel journal paired with a precise product introduction. Warm cream, deep teal ink, muted jade panels, small burnt-orange accents. Noto Sans supplies Vietnamese body copy; Lora supplies the expressive, Vietnamese-capable serif. A confident official-slogan headline leads into a wide scenic window. Minimal decoration, straight dividers, varied composition and clear availability.

Narrative: inspiration → planning friction and benefits → guided product concepts → project development/community → honest availability and questions. Combine feature and workflow explanation instead of repeating cards.

Desktop uses a split headline/copy, panoramic scenery, asymmetric photography/text, and a side-by-side feature guide with one large phone. Mobile uses a compact title, early scenery, a shorter image crop, horizontally arranged guide controls and a centered readable phone; community and closing CTA are recomposed independently. Tablet uses intermediate grids and compact navigation.

Motion: short staggered typography entrance, slow scenery zoom and decoded two-layer crossfade; horizontal guide-screen transition and a subtle route marker inside the product stage. No decorative icon cloud. Global pause, reduced motion, hidden-tab and offscreen policies stop nonessential work. Essential menus, dialog and content remain usable while paused.

## Facebook diagnosis and choice

Existing source has one official Page Plugin iframe, no clone, post array, automatic scrolling or feed polling. It can navigate again on ResizeObserver width changes; remove this automatic navigation path. New integration mounts once near its section and only navigates again after explicit retry. Public feed contents, pagination, provider cache and login/cookie restrictions are cross-origin; do not claim to fix duplicate content inside Meta without evidence.

Checked the [official Page Plugin documentation](https://developers.facebook.com/docs/plugins/page-plugin/); it currently returns a login wall to the research tool. Keep the established official plugin endpoint and timeline configuration. Newly published public posts are supplied by Meta on subsequent loads without code/deploy edits, subject to Meta caching and visibility. No live-update SLA or open-tab push subscription. No scraping or exposed tokens; a Graph API feed would require an authorized server and provider permissions, outside the supplied static environment.

## Implementation and acceptance

Keep HTML/CSS/JavaScript and GitHub Pages-relative assets. Replace the page structure and loaded style system rather than adding another override stylesheet. Reuse optimized licensed/project images and retain credits. One native dialog with focus trap/restore and scroll lock; one stable official Facebook iframe. Guide previews are explicitly illustrative, with no AI request or fake download.

Inspect real desktop, tablet, large/small mobile and landscape in-browser. Verify manual/autoplay scenery, guide controls/keyboard, menu, both platform dialogs, focus/scroll restoration, FAQ, translations, stable iframe and fallback. Run static artifact build, existing slideshow policy tests and diff checks. Record limitations honestly in REDESIGN_REPORT.md.
