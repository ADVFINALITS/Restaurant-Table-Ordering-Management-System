// Demo menu. In production this is replaced by whatever the Ruby API
// returns from GET /api/menu — see lib/api.js for the exact shape expected.

export const MENU = [
  {
    id: "mains",
    name: "Mains",
    items: [
      {
        id: "doro-wat",
        name: "Doro Wat",
        description: "Slow-simmered chicken in berbere sauce, served with a hard-boiled egg and injera.",
        price: 420,
        veg: false,
        spicy: true,
        available: true,
      },
      {
        id: "kitfo",
        name: "Kitfo",
        description: "Minced beef warmed in spiced butter, served leb-leb with ayib and gomen.",
        price: 460,
        veg: false,
        spicy: true,
        available: true,
      },
      {
        id: "tibs",
        name: "Tibs",
        description: "Pan-seared beef cubes with onion, rosemary and jalapeño, sizzled to order.",
        price: 440,
        veg: false,
        spicy: false,
        available: true,
      },
      {
        id: "shiro",
        name: "Shiro",
        description: "Spiced chickpea stew, simmered until silky, served with injera.",
        price: 260,
        veg: true,
        spicy: true,
        available: true,
      },
    ],
  },
  {
    id: "fasting",
    name: "Vegetarian / Fasting",
    items: [
      {
        id: "veggie-combo",
        name: "Veggie Combo",
        description: "Misir wot, gomen, atakilt wot and tikil gomen, arranged on injera.",
        price: 320,
        veg: true,
        spicy: false,
        available: true,
      },
      {
        id: "misir-wot",
        name: "Misir Wot",
        description: "Red lentils stewed in berbere and niter kibbeh.",
        price: 240,
        veg: true,
        spicy: true,
        available: true,
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      {
        id: "macchiato",
        name: "Ethiopian Macchiato",
        description: "Double shot, steamed milk, served in a small glass.",
        price: 80,
        veg: true,
        spicy: false,
        available: true,
      },
      {
        id: "avocado-juice",
        name: "Avocado & Mango Juice",
        description: "Layered fresh juice, no added sugar.",
        price: 140,
        veg: true,
        spicy: false,
        available: true,
      },
      {
        id: "ambo-water",
        name: "Ambo Water",
        description: "Sparkling natural mineral water, 500ml.",
        price: 60,
        veg: true,
        spicy: false,
        available: true,
      },
      {
        id: "tej",
        name: "Tej",
        description: "Traditional honey wine, served chilled in a berele.",
        price: 150,
        veg: true,
        spicy: false,
        available: true,
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      {
        id: "baklava",
        name: "Baklava",
        description: "Layered pastry, walnut filling, honey syrup.",
        price: 150,
        veg: true,
        spicy: false,
        available: true,
      },
      {
        id: "fruit-salad",
        name: "Fruit Salad",
        description: "Seasonal fruit, mint, a little lime.",
        price: 130,
        veg: true,
        spicy: false,
        available: true,
      },
    ],
  },
];

export function findMenuItem(itemId) {
  for (const category of MENU) {
    const found = category.items.find((item) => item.id === itemId);
    if (found) return found;
  }
  return null;
}
