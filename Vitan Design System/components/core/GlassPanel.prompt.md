The base Liquid Glass surface. Wrap any floating chrome — headers, popovers, action bars, the sort/filter controls — to get the tint + backdrop blur + specular edge + float shadow in one place.

```jsx
<GlassPanel material="thick" radius="var(--radius-xl)" style={{ padding: 16 }}>
  …popover contents…
</GlassPanel>
```

- `material`: `ultrathin | thin | regular | thick` (more = stronger blur + more opaque tint).
- Must float over the `.vitan-canvas` gradient (or any colorful/photographic backdrop) to read as glass.
