iOS rounded-fill text input (or textarea), used in the create/edit item form. Focus draws a 2px Vitan-green ring.

```jsx
<Input label="Item Name" placeholder="e.g. Walnut Side Table" />
<Input label="Price" prefix="ph ph-currency-dollar" inputMode="decimal" />
<Input label="Description" multiline placeholder="Describe your item…" />
```

`multiline` → textarea. `prefix` adds an inline Phosphor icon. `hint` shows helper text.
