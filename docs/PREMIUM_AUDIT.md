# GoEase premium enhancement — audit and plan

Audit date: 14 October 2026. Scope: local implementation and verification only. No commit, push, merge, workflow trigger, deployment or remote configuration change is authorized.

## Baseline

- Actual landing repository: `C:/Wed-GoEase/goease-site`, branch `main`, initial HEAD `ae662b4808748b3269d32899f98281402c889225`. Initial working tree is clean. `origin` is `https://github.com/tranthaigin/goease-introduce.git`.
- Static HTML with three CSS layers (`styles.css`, `theme.css`, `travel.css`) and one JavaScript file (`app.js`). No frontend framework, package dependencies, bundler, lint or existing automated tests. Node serves `dist`; `npm run check` checks JavaScript syntax.
- GitHub Actions publishes `dist` on push to main. The workflow and hosting configuration will not be changed or triggered.
- Sections reviewed: hero, values, features, three static phone mockups, journey tickets, closing CTA, FAQ, About/Facebook and footer. Vietnamese and English use DOM-backed translation strings. Native dialog supplies focus containment and Escape by default.
- Existing motion: reveal IntersectionObserver, phone fan, sequential ticket arrivals, logo/plane/orbit ambient effects, local pause control. Global pause, hidden-tab handling, slideshow and modal exit/scroll locking are missing.
- Mobile phones currently use zoom to squeeze all three into one row, making preview text too small. Tablet lacks an intentional intermediate showcase.
- Approved palette: cream #FFF8EF, teal #008B92, ink #123E4B, orange #F58B27. Official logo and slogan are retained. There is no dark-mode feature; only language is stored in localStorage.

## Product references

- Read current `C:/GoEase/go-ease-webapp/README.md` and `docs/MVP_EXPO_GO.md`; mobile product remains an early baseline, without released AI, API, maps or saved trips. Older `UI_DIRECTION.md` and `FEATURE_FLOWS.md` are no longer present in that separate project; it is read-only for this task.
- Connected Google Docs `EXE101_G17_03` was readable. Positioning: personal trip planning for Vietnam around interests, time and budget; the market research is not evidence of released functionality or GoEase usage numbers. No marketing statistics will be added.
- Consulted official Linear, Framer, Raycast and Notion landing pages for hierarchy, product presentation, readable spacing and restrained interaction. No brand colors or code are copied.

## Facebook evidence before modification

- Exactly one iframe in the website DOM. Source is the official Page Plugin for fanpage ID 61594839483458, `tabs=timeline`, width 340, height 420.
- Source initializes it once and disconnects its observer; no interval, pagination, cloning or repeated mount logic exists in the website.
- After scrolling inside the feed, its links still reference one story ID `122100927537494649`. Timestamp, expand, comment and share links refer to the same story; link repetition alone is not duplicate posts.
- The reported infinite duplicate-post loop was not reproduced during this audit. Console errors originate at `static.xx.fbcdn.net` with "Could not find element" from provider modules.
- The existing narrow, fixed-height embed produces nested scrolling and excessive image emphasis. Its outer container also participates in scroll animation. These website-owned weaknesses can be corrected. Third-party feed content, pagination and cache cannot be controlled across origins.

## Implementation plan

1. Preserve content, assets, light backgrounds and stack; add a focused enhancement layer rather than rebuild.
2. Add a two-layer hero slideshow with licensed Vietnam photos, responsive optimized assets, five-second pacing, manual controls, preloading and load-error recovery.
3. Consolidate motion pause/reduced-motion/visibility handling; reveal once, keep content accessible if motion stops, and make global controls available from the header and existing CTA.
4. Keep desktop phone fan; give tablet/mobile readable scroll-snap previews with explicit controls. Refine safe areas, navigation and focus states.
5. Keep native dialog, add animated close, scroll locking, focus restoration and rapid-toggle protection.
6. Keep officially supported Page Plugin as the automatic-public-post mechanism. Isolate it from reveal transforms, mount once at a deliberate width, add loading/fallback states and explicit retry only. Do not scrape or introduce frontend access tokens.
7. Verify all requested widths and core interactions in the supported browser. Document what cannot be verified, especially Meta cache/update delay, hidden-tab/reduced-motion emulation and hardware performance.
