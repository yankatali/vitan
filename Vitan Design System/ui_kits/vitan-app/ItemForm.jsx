// Create / Edit item form, presented in a Liquid Glass Sheet.
const { Sheet, Input, FilterChip, Button } = window.VitanDesignSystem_b00aee;

function ItemForm({ open, item, onClose, onSave }) {
  const editing = !!item;
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [cat, setCat] = React.useState("furniture");

  React.useEffect(() => {
    if (open) {
      setName(item?.name || "");
      setPrice(item ? String(item.price) : "");
      setDesc(item?.description || "");
      setCat(item?.category || "furniture");
    }
  }, [open, item]);

  const cats = window.VITAN_DATA.categories;
  const save = () => {
    onSave({ id: item?.id, name: name.trim() || "Untitled Item", price: parseFloat(price) || 0, description: desc.trim(), category: cat });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? "Edit Item" : "New Item"}
      footer={
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="lg" style={{ flex: 1, borderRadius: "var(--radius-capsule)" }} onClick={onClose}>Cancel</Button>
          <Button variant="accent" size="lg" style={{ flex: 2, borderRadius: "var(--radius-capsule)" }} icon="ph ph-check" onClick={save}>{editing ? "Save Changes" : "Add Item"}</Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ font: "var(--t-footnote)", fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 8px 4px" }}>Photos</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, aspectRatio: "1 / 1", borderRadius: "var(--radius-sm)", background: "var(--fill-tertiary)", border: "1.5px dashed var(--separator)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", cursor: "pointer" }}>
                <i className={i === 0 ? "ph ph-camera" : "ph ph-plus"} style={{ fontSize: i === 0 ? 24 : 20 }} />
              </div>
            ))}
          </div>
        </div>

        <Input label="Item Name" placeholder="e.g. Walnut Side Table" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Price" prefix="ph ph-currency-dollar" placeholder="0" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))} />

        <div>
          <div style={{ font: "var(--t-footnote)", fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 8px 4px" }}>Category</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cats.map((c) => (
              <FilterChip key={c.key} icon={c.icon} selected={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</FilterChip>
            ))}
          </div>
        </div>

        <Input label="Description" multiline placeholder="Describe your item — material, size, condition…" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
    </Sheet>
  );
}

Object.assign(window, { ItemForm });
