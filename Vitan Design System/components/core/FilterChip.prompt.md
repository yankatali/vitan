Toggleable filter pill for the filters popover (and inline filter rows). Selected pills fill Vitan-green and show a check.

```jsx
<FilterChip selected={f==="all"} onClick={() => setF("all")}>All</FilterChip>
<FilterChip icon="ph ph-tag" selected={f==="sale"} onClick={() => setF("sale")}>On Sale</FilterChip>
```
