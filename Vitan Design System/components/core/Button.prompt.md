Primary action control for Vitan — solid Vitan-green by default, with Liquid Glass, tinted, plain, and destructive variants. Use for any tap target that performs an action.

```jsx
<Button variant="accent" icon="ph ph-bag" onClick={addToCart}>Add to Cart</Button>
<Button variant="glass">Apply Filters</Button>
<Button variant="destructive" icon="ph ph-trash">Delete Item</Button>
```

- `variant`: `accent` (default CTA) · `glass` (floating chrome) · `tinted` (soft accent) · `plain` (text link) · `destructive` (red, for delete).
- `size`: `sm | md | lg`. `block` for full width. `icon` takes a Phosphor class.
- Press = scale 0.96 squish; accent/destructive darken on hover.
