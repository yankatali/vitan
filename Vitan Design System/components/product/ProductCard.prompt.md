The central Vitan surface — a product listing card. Swipeable photo carousel (dots + tap zones when >1 image), name, price (with sale support), 2-line description, and an actions row: Add to Cart primary, plus Edit/Delete icon buttons when `owner`.

```jsx
<ProductCard
  name="Walnut Side Table"
  price={129} compareAt={159}
  description="Solid walnut, hand-oiled finish. 45cm tall."
  images={[url1, url2, url3]}
  badge={{ label: "-20%", tone: "sale", solid: true }}
  favorite={fav} onToggleFavorite={setFav}
  onAddToCart={add} owner onEdit={edit} onDelete={del}
/>
```

- Sits on opaque white (it's content, not glass). Place on the `.vitan-canvas`.
- `owner` reveals Edit (pencil) + Delete (red trash) icon buttons next to Add to Cart.
- Composes PriceTag, FavoriteButton, Button, IconButton, Badge — don't re-implement those.
