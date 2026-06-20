# Vitan Design System

**Vitan** is a product-catalog app — users browse items as rich cards (photo carousel, name, price, description), add to cart or favorites, and (as item owners) create, edit, and delete listings. The interface is built entirely in the **iOS-26 "Liquid Glass"** language, drawing specifically on the latest **Telegram for iOS** glass surfaces (floating frosted tab bar, translucent headers, glass popovers).

> No external codebase or Figma was provided. This system was authored from the stated visual direction: **iOS 26 Liquid Glass + Telegram iOS Liquid Glass**. It is internally consistent and ready to extend — see the **CAVEATS / ASK** at the end.

## Sources
- Visual direction only (no design files attached): "iOS 26 Liquid Glass" and "latest Telegram iOS Liquid Glass".
- Apple Human Interface Guidelines conventions (type ramp, system colors, label-alpha model, 44pt hit targets) informed the token layer.

---

## CONTENT FUNDAMENTALS

**Voice.** Crisp, friendly, utilitarian — the way iOS itself speaks. Labels are short and concrete. Verbs lead actions ("Add to Cart", "Save", "Delete Item"). No marketing fluff inside the product.

**Casing.** **Title Case** for buttons, tab labels, and screen titles ("Add to Cart", "New Item", "Favorites"). Sentence case for descriptions, helper text, and empty states ("No items match these filters.").

**Person.** Address the user as **you**; the system is invisible ("Your cart", "Saved to Favorites"). Avoid "we".

**Price.** Always currency-symbol prefixed, two decimals only when needed ("$24", "$24.50"). Price is the loudest text on a card after the name.

**Empty / loading.** Calm and instructive, never cute: "Nothing here yet — tap ＋ to add your first item."

**Emoji.** Not used in product chrome. Real iconography (Phosphor / SF-Symbol-style) carries meaning instead.

**Examples.**
- Buttons: `Add to Cart` · `Save Changes` · `Delete Item` · `Apply Filters` · `Clear All`
- Toasts: `Added to cart` · `Saved to Favorites` · `Item deleted`
- Tabs: `Shop` · `Favorites` · `Cart` · `Profile`

---

## VISUAL FOUNDATIONS

**Material is the brand.** Almost every floating surface (header, tab bar, filter popover, action buttons, sort control) is *Liquid Glass*: a translucent tint over a real `backdrop-filter: blur() saturate()`, finished with a **specular edge** — a bright inset rim along the top/left and a faint dark grounding line along the bottom. Glass always floats over a soft, vibrant canvas (`.vitan-canvas`: layered green/blue/purple radial gradients on `#F2F2F7`) so there is color to refract. Glass over flat white is avoided — it has nothing to bend.

**Color.** Neutral structure (iOS label-alpha blacks, translucent gray fills) + a single confident accent: **Vitan green `#10C775`** (vitality). System colors appear only semantically — pink `#FF2D55` for favorites, red `#FF3B30` for destructive/delete, blue `#007AFF` for links. Imagery is shown bright and warm, full-saturation; no b&w or heavy grain.

**Type.** Apple **SF Pro** via the `-apple-system` stack (real SF Pro on Apple hardware; **Albert Sans** loaded as the cross-platform fallback — flagged substitution). The iOS text-style ramp drives everything: Large Title 34, Title 22–28, Headline 17 semibold, Body 17, Subhead 15, Footnote 13, Caption 12/11. Display sizes carry tight tracking (`-0.4px`).

**Spacing.** Strict 4pt grid. Screen gutter 16px. Cards breathe at 12–16px internal padding. Generous vertical rhythm between sections (24–32px).

**Corners.** Continuous, generous radii — cards 20px, sheets/popovers 26–34px, glass buttons capsule or 16px, the tab bar a full capsule. Nothing sharp.

**Shadows.** Two layers, soft and low-contrast: a tight contact shadow + a wide ambient float. Glass surfaces add the inset specular rim on top of the float shadow. No hard or colored drop shadows.

**Borders.** Real borders are rare. Separation comes from the glass rim and `--separator` hairlines (`rgba(60,60,67,0.2)`), never heavy 1px gray boxes.

**Backgrounds.** The app canvas is a soft multi-radial gradient field (never a flat color, never a photo behind everything). Cards sit on opaque white; chrome floats as glass above.

**Transparency & blur.** Reserved for *floating chrome* — headers, tab bar, popovers, action bars, the sort/filter controls. Content (product cards, images, body text) is opaque and crisp. This is the iOS rule: blur is a layer signal, not decoration.

**Motion.** iOS easing `cubic-bezier(0.32,0.72,0,1)` for sheets/transitions; a gentle spring `cubic-bezier(0.5,1.4,0.4,1)` for press/pop. Sheets slide up; popovers scale-fade from their anchor; favorites pop with a small overshoot. No infinite loops, no bounce-heavy choreography. Respect `prefers-reduced-motion`.

**Hover (pointer).** Glass brightens slightly (tint +opacity); solid buttons darken ~6%. Subtle, never a color flip.

**Press (touch).** Scale to `0.96` + brief darken/opacity dip — the iOS "squish". Capsules and cards both squish on tap.

**Cards.** Opaque white, 20px radius, soft two-layer shadow, no border. Image sits flush to the top with matching top radius; content padded 12–14px. Favorite heart floats top-right as a small glass chip.

---

## ICONOGRAPHY

- **System:** [Phosphor Icons](https://phosphoricons.com) via CDN — `<script src="https://unpkg.com/@phosphor-icons/web"></script>`, used as `<i class="ph ph-magnifying-glass"></i>`.
- **Why Phosphor:** SF Symbols (the true iOS set) is not web-redistributable. Phosphor's geometric, rounded, consistent-metric forms are the closest free match, and crucially it ships **weight variants** — `ph` (regular line) for inactive states and `ph-fill` for active states, mirroring SF Symbols' line→fill tab-bar behavior. **Flagged substitution** — swap for real SF Symbols assets in production if licensing allows.
- **Usage:** line weight (`ph`) for toolbar/inline icons; `ph-fill` for the selected tab and for the favorite heart when active; `ph-bold` sparingly for emphasis. Icon color inherits `currentColor`. Standard sizes 17/20/24px to sit on the type ramp.
- **No emoji** in product chrome. No ad-hoc unicode glyphs as icons. No hand-drawn SVG icons — Phosphor only, kept consistent.

---

## INDEX

**Root**
- `styles.css` — entry point (imports only). Consumers link this.
- `readme.md` — this file. `SKILL.md` — portable skill manifest.

**Tokens** (`tokens/`)
- `colors.css` · `typography.css` · `spacing.css` · `glass.css` (Liquid Glass materials) · `base.css` (resets + `.vitan-canvas`).

**Components** (`components/`) — see each `*.prompt.md`
- `core/` — Button, IconButton, GlassPanel, Badge, Input, SearchField, FilterChip, SortControl, SegmentedControl
- `product/` — ProductCard, PriceTag, FavoriteButton
- `navigation/` — TabBar
- `feedback/` — Sheet, Toast

**UI kit** (`ui_kits/vitan-app/`) — interactive catalog, product detail, create/edit sheet, filters popover.

**Guidelines** (`guidelines/`) — foundation specimen cards (Type, Colors, Spacing, Glass).

---

## CAVEATS / ASK
See the end-of-build note in chat.
