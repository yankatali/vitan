Glass sort capsule for the toolbar — shows the active sort key and a green direction-arrow segment that flips ascending/descending on tap.

```jsx
<SortControl label="Price" direction={dir} onToggleDirection={flip} onPick={openSortMenu} />
```

Tapping the label area opens a sort-key menu (`onPick`); tapping the arrow flips direction (`onToggleDirection`).
