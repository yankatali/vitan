---
name: vitan-design
description: Use this skill to generate well-branded interfaces and assets for Vitan, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in the iOS-26 / Telegram-iOS "Liquid Glass" style.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `readme.md` — brand context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, and the file index. Read this first.
- `styles.css` — link this one file to inherit all tokens. It `@import`s `tokens/` (colors, typography, spacing, **glass** materials, base + `.vitan-canvas`).
- `tokens/glass.css` — the Liquid Glass system: tint + `backdrop-filter` blur/saturate + specular edge + float shadow. `.glass`, `.glass-thin`, `.glass-thick` utilities.
- `components/` — React primitives (Button, IconButton, GlassPanel, Badge, Input, SearchField, FilterChip, SortControl, SegmentedControl, ProductCard, PriceTag, FavoriteButton, TabBar, Sheet, Toast). Each has a `.prompt.md` with usage.
- `ui_kits/vitan-app/` — full interactive catalog app to copy from.
- `guidelines/` — foundation specimen cards.

## Non-negotiables
- Glass must float over a colorful/photographic backdrop (use `.vitan-canvas`) — never over flat white.
- One accent: Vitan green `#10C775`. System colors only semantically (pink=favorite, red=delete, blue=link, orange=sale).
- SF Pro via the `-apple-system` stack; Phosphor icons (`ph` line / `ph-fill` active). No emoji. No hand-drawn SVG icons.
- Generous continuous radii, soft two-layer shadows, press = scale-0.96 squish, iOS easing.
