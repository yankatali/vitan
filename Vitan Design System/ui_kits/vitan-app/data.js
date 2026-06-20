// Sample catalog data for the Vitan UI kit.
window.VITAN_DATA = {
  categories: [
    { key: "furniture", label: "Furniture", icon: "ph ph-armchair" },
    { key: "lighting", label: "Lighting", icon: "ph ph-lamp" },
    { key: "plants", label: "Plants", icon: "ph ph-plant" },
    { key: "decor", label: "Decor", icon: "ph ph-frame-corners" },
    { key: "kitchen", label: "Kitchen", icon: "ph ph-cooking-pot" },
  ],
  img: (s) => `https://picsum.photos/seed/${s}/700/700`,
  products: [
    { id: "p1", name: "Walnut Side Table", price: 129, compareAt: 159, category: "furniture", stock: true,
      description: "Solid walnut with a hand-oiled finish. 45cm tall, ships flat with tool-free assembly.",
      images: ["vitan-table-a", "vitan-table-b", "vitan-table-c"], owner: true },
    { id: "p2", name: "Arc Floor Lamp", price: 89, category: "lighting", stock: true,
      description: "Brushed-brass arc with a linen drum shade. Dimmable, 1.8m reach.",
      images: ["vitan-lamp-a", "vitan-lamp-b"] },
    { id: "p3", name: "Stoneware Planter", price: 34, category: "plants", stock: true,
      description: "Matte stoneware with a hidden drainage tray. Pairs with mid-size foliage.",
      images: ["vitan-planter-a", "vitan-planter-b"], owner: true },
    { id: "p4", name: "Linen Throw", price: 48, compareAt: 60, category: "decor", stock: true,
      description: "Stonewashed French linen, fringed edge. Warm sand colourway.",
      images: ["vitan-throw-a"] },
    { id: "p5", name: "Ceramic Pour-Over", price: 42, category: "kitchen", stock: false,
      description: "Single-cup pour-over in speckled clay. Fits standard #2 filters.",
      images: ["vitan-pour-a", "vitan-pour-b"] },
    { id: "p6", name: "Oak Stool", price: 76, category: "furniture", stock: true,
      description: "Stackable solid-oak stool with a sculpted seat. 45cm.",
      images: ["vitan-stool-a", "vitan-stool-b"] },
    { id: "p7", name: "Paper Pendant", price: 64, category: "lighting", stock: true,
      description: "Hand-folded rice-paper pendant. Soft, even glow. 40cm dia.",
      images: ["vitan-pendant-a"] },
    { id: "p8", name: "Trailing Pothos", price: 22, category: "plants", stock: true,
      description: "Easy-care trailing pothos in a 14cm nursery pot.",
      images: ["vitan-pothos-a", "vitan-pothos-b"] },
  ],
};
// This is the user's own catalog — they own every listing (edit/delete everywhere).
window.VITAN_DATA.products.forEach((p) => { p.owner = true; });
