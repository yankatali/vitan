Capsule Liquid-Glass search field that lives in the header. Shows a clear (✕) affordance once there's a value.

```jsx
<SearchField value={q} onChange={e => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Search items" />
```
