iOS segmented control with a sliding white thumb — for switching views/scopes (e.g. All / In Stock / On Sale, or grid/list).

```jsx
<SegmentedControl options={["All","In Stock","On Sale"]} value={scope} onChange={setScope} />
```

Options can be plain strings or `{label, value}` objects.
