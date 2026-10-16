# Opaque paper header

Supersedes the dark glass header in GLASS_HEADER_AND_CONTROLS.md.

- Header and mobile menu now use solid warm white (#fffdf8), with muted green text and a low-contrast cream selected state.
- An opaque cream strip behind the floating capsule covers the full viewport width above content (108 px desktop, 94 px mobile). It blocks pointer events from reaching concealed content. No translucent header or background-content bleed remains.
- `header-nav.js` replaces the particle/SVG goo effect with one rounded selection surface. Position and width transition for 420 ms with the existing ease; rapid selection retargets the current CSS transition. No particle bursts or continuously running effect.
- Header CTA uses a lighter brass gradient, reduced specular opacity (.3) and 1 px hover lift. Other page controls retain their current palette.
- Scroll padding leaves section headings below the opaque strip. Native links, current-section tracking, keyboard focus, language switching, reduced motion and global pause remain.

Validation: production build and JavaScript syntax, existing 8 route/motion tests; Chrome at desktop, 1366x768 and 390x844. Checked opaque computed backgrounds, full-width strip dimensions, menu selection/close, rapid header navigation, target offset and no horizontal overflow. Browser responsive checks, not physical mobile hardware.
