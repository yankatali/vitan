// Catalog screen — header (name + search + create in one row), filter + sort
// toolbar, and the product grid. Composes DS components from the bundle.
const { Button, IconButton, SearchField, FilterChip, ProductCard, GlassPanel } =
  window.VitanDesignSystem_b00aee;

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent", icon: "ph ph-clock-counter-clockwise" },
  { value: "price-asc", label: "Price: Low to High", icon: "ph ph-arrow-up" },
  { value: "price-desc", label: "Price: High to Low", icon: "ph ph-arrow-down" },
  { value: "name", label: "Name: A to Z", icon: "ph ph-sort-ascending" },
];

function CatalogHeader({ query, setQuery, onCreate }) {
  return (
    <GlassPanel
      material="thick"
      radius="0"
      style={{
        position: "sticky", top: 0, zIndex: 40,
        padding: "calc(env(safe-area-inset-top, 8px) + 12px) 16px 14px",
        display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <span style={{ font: "var(--t-title1)", letterSpacing: "-0.5px", color: "var(--text-primary)", flexShrink: 0 }}>Vitan</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <SearchField value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery("")} placeholder="Search" />
      </div>
      <IconButton icon="ph ph-plus" variant="accent" label="New Item" onClick={onCreate} />
    </GlassPanel>
  );
}

function SortMenu({ sort, setSort, open, onClose }) {
  if (!open) return null;
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 44 }} />
      <GlassPanel
        material="thick"
        radius="var(--radius-md)"
        style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 45,
          width: 232, padding: 6, overflow: "hidden",
        }}
      >
        {SORT_OPTIONS.map((o, i) => {
          const active = sort === o.value;
          return (
            <button
              key={o.value}
              onClick={() => { setSort(o.value); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "11px 12px", border: "none", cursor: "pointer",
                background: active ? "var(--vitan-tint)" : "transparent",
                borderRadius: "var(--radius-xs)",
                color: active ? "var(--accent-press)" : "var(--text-primary)",
                font: `${active ? 600 : 500} 15px/1 var(--font-text)`,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <i className={o.icon} style={{ fontSize: 18, color: active ? "var(--accent)" : "var(--text-secondary)" }} />
              <span style={{ flex: 1, textAlign: "left" }}>{o.label}</span>
              {active && <i className="ph-bold ph-check" style={{ fontSize: 16, color: "var(--accent)" }} />}
            </button>
          );
        })}
      </GlassPanel>
    </React.Fragment>
  );
}

function Toolbar({ activeCount, onOpenFilters, sort, setSort }) {
  const [sortOpen, setSortOpen] = React.useState(false);
  const isDefault = sort === "recent";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px", gap: 10 }}>
      <button
        onClick={onOpenFilters}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 14px",
          borderRadius: "var(--radius-capsule)", border: "none", cursor: "pointer",
          background: "var(--glass-tint-regular)", backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
          boxShadow: "var(--glass-specular), var(--shadow-card)",
          font: "600 15px/1 var(--font-text)", color: "var(--text-primary)", letterSpacing: "-0.1px",
        }}
      >
        <i className="ph ph-sliders-horizontal" style={{ fontSize: 18 }} />
        Filters
        {activeCount > 0 && (
          <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10, background: "var(--accent)", color: "#fff", font: "700 12px/20px var(--font-text)", textAlign: "center" }}>{activeCount}</span>
        )}
      </button>

      <div style={{ position: "relative" }}>
        <IconButton
          icon="ph ph-arrows-down-up"
          variant="glass"
          label="Sort"
          active={!isDefault || sortOpen}
          onClick={() => setSortOpen((o) => !o)}
        />
        {!isDefault && (
          <span style={{ position: "absolute", top: 1, right: 1, width: 10, height: 10, borderRadius: 5, background: "var(--accent)", boxShadow: "0 0 0 2px var(--bg-elevated)" }} />
        )}
        <SortMenu sort={sort} setSort={setSort} open={sortOpen} onClose={() => setSortOpen(false)} />
      </div>
    </div>
  );
}

function Catalog({ products, favs, onToggleFav, onAddToCart, onOpen, onCreate, onEdit, onDelete, onOpenFilters, query, setQuery, activeFilterCount, sort, setSort }) {
  return (
    <div>
      <CatalogHeader query={query} setQuery={setQuery} onCreate={onCreate} />
      <Toolbar activeCount={activeFilterCount} onOpenFilters={onOpenFilters} sort={sort} setSort={setSort} />
      <div style={{ padding: "4px 16px 130px" }}>
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
            <i className="ph ph-magnifying-glass" style={{ fontSize: 40, color: "var(--text-tertiary)" }} />
            <p style={{ font: "var(--t-body)", marginTop: 12 }}>No items match these filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {products.map((p) => (
              <div key={p.id} onClick={() => onOpen(p)} style={{ cursor: "pointer", height: "100%" }}>
                <ProductCard
                  name={p.name}
                  price={p.price}
                  compareAt={p.compareAt}
                  description={p.description}
                  images={p.images.map(window.VITAN_DATA.img)}
                  badge={p.compareAt ? { label: `-${Math.round((1 - p.price / p.compareAt) * 100)}%`, tone: "sale", solid: true } : (!p.stock ? { label: "Sold Out", tone: "neutral" } : null)}
                  favorite={!!favs[p.id]}
                  onToggleFavorite={() => onToggleFav(p.id)}
                  onAddToCart={(e) => { e && e.stopPropagation && e.stopPropagation(); onAddToCart(p); }}
                  owner={p.owner}
                  onEdit={(e) => { e && e.stopPropagation && e.stopPropagation(); onEdit(p); }}
                  onDelete={(e) => { e && e.stopPropagation && e.stopPropagation(); onDelete(p); }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Catalog });
