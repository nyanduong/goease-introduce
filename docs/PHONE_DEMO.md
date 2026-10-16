# Interactive phone preview

Section 02 is a local prototype in `dist/phone-demo.js`, initialized by `interactions.js`. It does not call AI, booking, pricing or invitation services. Changes to section backgrounds were explicitly cancelled; this work only affects phone controls.

- Four information fields open an accessible editor within the phone bezel: destination, start date/trip length, group size and budget limit.
- Six interests toggle independently. The four upper shortcuts open information/preferences/budget or continue to the itinerary.
- Itinerary, Details, Budget and Members are real buttons. Day controls and an illustrative route view work within the preview.
- Destinations update the title, image and sample activities. Group size and duration rescale sample cost categories; each category can also be edited. Totals, remaining allowance, percentage and per-person amount update together.
- Details can save a demo in this browser's local storage, restore it on reload, or reset the sample. Nothing is sent externally.
- Editors support Escape, focus containment and focus restoration. Phone navigation preserves viewport position. Vietnamese/English labels follow the site's language choice.

Browser checks on Chrome: changing destination, date and duration; interests; group size; all four tabs; changing one cost and budget limit; over-budget state; saving/reloading; resetting; English labels; route editor; eight-member layout. Responsive checks at 390 × 844: no horizontal overflow, editing from Details and route editor. Create, Details and Members panels retain their 600px internal height without clipped controls. These are desktop browser responsive checks, not physical-device tests.
