Liquid Glass bottom sheet (iOS sheet) — slides up with a grabber, dimmed scrim, optional title bar and sticky footer. Used for the filters popover, the create/edit item form, and confirmations.

```jsx
<Sheet open={open} onClose={close} title="Filters"
  footer={<Button block onClick={apply}>Apply Filters</Button>}>
  …filter chips…
</Sheet>
```

Esc and scrim-tap close. Provide `footer` for primary actions so they stay pinned.
