Floating Liquid Glass bottom tab bar — the Telegram-iOS pattern. A frosted capsule that hovers above content; the active tab fills with a green-tinted pill, a filled (`ph-fill`) icon, and accent color.

```jsx
<TabBar
  value={tab} onChange={setTab}
  items={[
    { value: "shop", label: "Shop", icon: "ph-storefront" },
    { value: "favorites", label: "Favorites", icon: "ph-heart" },
    { value: "cart", label: "Cart", icon: "ph-shopping-bag", badge: 3 },
    { value: "profile", label: "Profile", icon: "ph-user" },
  ]}
/>
```

`icon` is the Phosphor name without weight prefix — the component swaps `ph`→`ph-fill` when active. `floating` (default) fixes it bottom-center.
