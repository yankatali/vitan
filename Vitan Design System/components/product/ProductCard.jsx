import React from "react";
import { PriceTag } from "./PriceTag.jsx";
import { FavoriteButton } from "./FavoriteButton.jsx";
import { Button } from "../core/Button.jsx";
import { IconButton } from "../core/IconButton.jsx";
import { Badge } from "../core/Badge.jsx";

/** Internal swipeable image carousel with dots + tap zones. */
function ImageCarousel({ images, ratio = "1 / 1", radius }) {
  const [i, setI] = React.useState(0);
  const start = React.useRef(null);
  const list = images && images.length ? images : [null];
  const n = list.length;
  const go = (d) => setI((p) => (p + d + n) % n);

  return (
    <div
      style={{ position: "relative", aspectRatio: ratio, borderRadius: radius, overflow: "hidden", background: "var(--fill)" }}
      onTouchStart={(e) => (start.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (start.current == null) return;
        const dx = e.changedTouches[0].clientX - start.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        start.current = null;
      }}
    >
      <div style={{ display: "flex", height: "100%", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-base) var(--ease-glass)" }}>
        {list.map((src, idx) => (
          <div key={idx} style={{ flex: "0 0 100%", height: "100%" }}>
            {src ? (
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
                <i className="ph ph-image" style={{ fontSize: 40 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button aria-label="Previous" onClick={() => go(-1)}
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32%", border: "none", background: "transparent", cursor: "pointer" }} />
          <button aria-label="Next" onClick={() => go(1)}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "32%", border: "none", background: "transparent", cursor: "pointer" }} />
          <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
            {list.map((_, idx) => (
              <span key={idx} style={{
                width: idx === i ? 16 : 6, height: 6, borderRadius: 3,
                background: idx === i ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                transition: "width var(--dur-base) var(--ease-glass)",
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * ProductCard — the central Vitan surface. Swipeable photo(s), name,
 * price, description, and actions (Add to Cart + favorite; Edit/Delete
 * for owners).
 */
export function ProductCard({
  name,
  price,
  compareAt = null,
  description,
  images = [],
  badge = null,
  favorite = false,
  onToggleFavorite,
  onAddToCart,
  onEdit,
  onDelete,
  owner = false,
  style = {},
  ...rest
}) {
  return (
    <article
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "relative" }}>
        <ImageCarousel images={images} radius="0" />
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <FavoriteButton active={favorite} onToggle={onToggleFavorite} />
        </div>
        {badge && (
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <Badge tone={badge.tone || "sale"} solid={badge.solid}>{badge.label}</Badge>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "12px 13px 13px", flex: 1 }}>
        <h3 style={{
          margin: 0, font: "var(--t-headline)", color: "var(--text-primary)", letterSpacing: "-0.3px",
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{name}</h3>
        <PriceTag amount={price} compareAt={compareAt} size="md" />
        {description && (
          <p style={{
            margin: 0, font: "var(--t-subhead)", color: "var(--text-secondary)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{description}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", paddingTop: 6 }}>
          <Button variant="accent" size="sm" icon="ph ph-shopping-bag" block onClick={onAddToCart}>Add to Cart</Button>
          {owner && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" icon="ph ph-pencil-simple" onClick={onEdit} style={{ flex: 1 }}>Edit</Button>
              <Button variant="destructiveTinted" size="sm" icon="ph ph-trash" onClick={onDelete} style={{ flex: 1 }}>Delete</Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
