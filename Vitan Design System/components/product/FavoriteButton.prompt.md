Heart favorite toggle. Floating glass chip by default (sits top-right on product images); pops with a spring when activated, fills pink.

```jsx
<FavoriteButton active={fav} onToggle={setFav} />
<FavoriteButton active={fav} onToggle={setFav} chip={false} size={28} /> {/* inline, no chip */}
```
