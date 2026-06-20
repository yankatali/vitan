Circular Liquid-Glass icon button — the workhorse for header actions (search, ＋), the favorite heart, and inline controls.

```jsx
<IconButton icon="ph ph-magnifying-glass" label="Search" />
<IconButton icon="ph ph-plus" variant="accent" label="New Item" />
<IconButton icon="ph-fill ph-heart" active activeColor="var(--favorite)" label="Favorite" />
```

- `variant`: `glass` (default floating chip) · `fill` (subtle gray) · `accent` (solid green) · `plain`.
- `size` is the diameter; icon scales to ~50%. Press squishes to 0.9. Pass `ph-fill` icon when `active` for filled states.
