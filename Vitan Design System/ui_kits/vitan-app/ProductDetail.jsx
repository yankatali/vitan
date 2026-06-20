// Product detail screen — full-bleed photo carousel, glass back/favorite
// controls, info, and a pinned glass Add-to-Cart bar.
const { IconButton, FavoriteButton, PriceTag, Button, Badge, GlassPanel } =
  window.VitanDesignSystem_b00aee;

function DetailCarousel({ images }) {
  const [i, setI] = React.useState(0);
  const start = React.useRef(null);
  const n = images.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return (
    <div
      style={{ position: "relative", aspectRatio: "4 / 3", background: "var(--fill)", overflow: "hidden" }}
      onTouchStart={(e) => (start.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { if (start.current == null) return; const dx = e.changedTouches[0].clientX - start.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); start.current = null; }}
    >
      <div style={{ display: "flex", height: "100%", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-base) var(--ease-glass)" }}>
        {images.map((src, idx) => (
          <img key={idx} src={src} alt="" style={{ flex: "0 0 100%", width: "100%", height: "100%", objectFit: "cover" }} />
        ))}
      </div>
      {n > 1 && (
        <React.Fragment>
          <button aria-label="Previous" onClick={() => go(-1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32%", border: "none", background: "transparent", cursor: "pointer" }} />
          <button aria-label="Next" onClick={() => go(1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32%", border: "none", background: "transparent", cursor: "pointer" }} />
          <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
            {images.map((_, idx) => (
              <span key={idx} style={{ width: idx === i ? 18 : 7, height: 7, borderRadius: 4, background: idx === i ? "#fff" : "rgba(255,255,255,0.6)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "width var(--dur-base) var(--ease-glass)" }} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function ProductDetail({ product, fav, onToggleFav, onBack, onAddToCart, onEdit, onDelete }) {
  const p = product;
  const cat = window.VITAN_DATA.categories.find((c) => c.key === p.category);
  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      <div style={{ position: "relative" }}>
        <DetailCarousel images={p.images.map(window.VITAN_DATA.img)} />
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 8px) + 10px)", left: 14, right: 14, display: "flex", justifyContent: "space-between" }}>
          <IconButton icon="ph-bold ph-arrow-left" size={40} label="Back" onClick={onBack} />
          <FavoriteButton active={fav} onToggle={onToggleFav} size={40} />
        </div>
      </div>

      <div style={{ padding: "18px 18px 150px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {cat && <Badge tone="accent"><i className={cat.icon} style={{ fontSize: 13, marginRight: 2 }} />{cat.label}</Badge>}
          {!p.stock && <Badge tone="neutral">Sold Out</Badge>}
        </div>
        <h1 style={{ margin: 0, font: "var(--t-title1)", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>{p.name}</h1>
        <PriceTag amount={p.price} compareAt={p.compareAt} size="lg" />
        <p style={{ margin: 0, font: "var(--t-body)", color: "var(--text-secondary)" }}>{p.description}</p>

        {p.owner && (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Button variant="secondary" icon="ph ph-pencil-simple" style={{ flex: 1 }} onClick={onEdit}>Edit Item</Button>
            <Button variant="destructiveTinted" icon="ph ph-trash" style={{ flex: 1 }} onClick={onDelete}>Delete</Button>
          </div>
        )}
      </div>

      <GlassPanel material="thick" radius="0" style={{ position: "fixed", left: 0, right: 0, bottom: 0, padding: "14px 18px calc(env(safe-area-inset-bottom, 10px) + 14px)", display: "flex", alignItems: "center", gap: 14, zIndex: 60 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ font: "var(--t-caption1)", color: "var(--text-secondary)" }}>Price</span>
          <PriceTag amount={p.price} size="md" />
        </div>
        <Button variant="accent" size="lg" icon="ph ph-shopping-bag" block style={{ flex: 1 }} onClick={() => onAddToCart(p)} disabled={!p.stock}>
          {p.stock ? "Add to Cart" : "Sold Out"}
        </Button>
      </GlassPanel>
    </div>
  );
}

Object.assign(window, { ProductDetail });
