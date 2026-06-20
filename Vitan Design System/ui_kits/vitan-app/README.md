# Vitan App — UI Kit

Interactive Liquid Glass recreation of the Vitan product-catalog app. Open `index.html`.

## Screens & flow
- **Catalog** (`Catalog.jsx`) — glass header (Vitan wordmark · notifications · ＋ create), persistent search field, a Filters button (opens the filters sheet, shows an active-count badge) and a glass Sort control with an up/down direction toggle. Below: a two-up grid of `ProductCard`s.
- **Product detail** (`ProductDetail.jsx`) — full-bleed swipeable photo carousel, glass back + favorite controls, category badge, title, price, description, owner Edit/Delete, and a pinned glass Add-to-Cart bar.
- **Item form** (`ItemForm.jsx`) — create/edit listing in a glass `Sheet`: photo slots, name, price, category chips, description.
- **Filters sheet** (`FiltersSheet.jsx`) — availability segmented control, category multi-select chips, sort key.
- **Cart / Profile / Favorites** — favorites filters the grid; cart & profile are intentionally light placeholders (out of scope).

## What's interactive
Search, filter (availability + category), sort (key + direction), favorite (with toast), add to cart (badge + toast), create / edit / delete items, open & navigate product detail, switch tabs via the floating glass `TabBar`.

## Composition
Built entirely from design-system components (`window.VitanDesignSystem_b00aee`): `ProductCard, PriceTag, FavoriteButton, Button, IconButton, SearchField, SortControl, FilterChip, SegmentedControl, Badge, GlassPanel, Sheet, Toast, TabBar`. No primitives are re-implemented here.

## Notes
- Presented at iOS phone width (430px). `.app` carries a `transform` so fixed chrome (tab bar, sheets, toast, detail bar) is contained within the app column rather than the whole viewport.
- Demo imagery is seeded [Lorem Picsum](https://picsum.photos) photos — swap for real product images in production.
- Icons are [Phosphor](https://phosphoricons.com) (CDN) — the flagged SF Symbols substitute.
