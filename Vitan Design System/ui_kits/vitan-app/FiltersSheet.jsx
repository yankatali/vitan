// Filters sheet — availability scope + category multi-select + sort key.
const { Sheet, SegmentedControl, FilterChip, Button } = window.VitanDesignSystem_b00aee;

function FiltersSheet({ open, onClose, scope, setScope, cats, setCats, onClear }) {
  const categories = window.VITAN_DATA.categories;
  const toggle = (k) => setCats(cats.includes(k) ? cats.filter((x) => x !== k) : [...cats, k]);
  const Label = ({ children }) => (
    <div style={{ font: "var(--t-footnote)", fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 10px 4px" }}>{children}</div>
  );
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="lg" style={{ flex: 1, borderRadius: "var(--radius-capsule)" }} onClick={onClear}>Clear All</Button>
          <Button variant="accent" size="lg" style={{ flex: 2, borderRadius: "var(--radius-capsule)" }} onClick={onClose}>Show Results</Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <Label>Availability</Label>
          <SegmentedControl
            options={[{ label: "All", value: "all" }, { label: "In Stock", value: "stock" }, { label: "On Sale", value: "sale" }]}
            value={scope}
            onChange={setScope}
          />
        </div>
        <div>
          <Label>Category</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <FilterChip key={c.key} icon={c.icon} selected={cats.includes(c.key)} onClick={() => toggle(c.key)}>{c.label}</FilterChip>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

Object.assign(window, { FiltersSheet });
