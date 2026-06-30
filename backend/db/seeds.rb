# This file should ensure the existence of records required to run the
# application in every environment. Run with:
#   bin/rails db:seed
#
# The menu below mirrors restaurant-frontend/lib/menu.js exactly, so
# switching the frontend from demo mode to this real backend doesn't
# change what a diner sees.

CATEGORIES = [
  {
    slug: "mains",
    name: "Mains",
    items: [
      { slug: "doro-wat", name: "Doro Wat", description: "Slow-simmered chicken in berbere sauce, served with a hard-boiled egg and injera.", price: 420, veg: false, spicy: true },
      { slug: "kitfo", name: "Kitfo", description: "Minced beef warmed in spiced butter, served leb-leb with ayib and gomen.", price: 460, veg: false, spicy: true },
      { slug: "tibs", name: "Tibs", description: "Pan-seared beef cubes with onion, rosemary and jalapeño, sizzled to order.", price: 440, veg: false, spicy: false },
      { slug: "shiro", name: "Shiro", description: "Spiced chickpea stew, simmered until silky, served with injera.", price: 260, veg: true, spicy: true },
    ],
  },
  {
    slug: "fasting",
    name: "Vegetarian / Fasting",
    items: [
      { slug: "veggie-combo", name: "Veggie Combo", description: "Misir wot, gomen, atakilt wot and tikil gomen, arranged on injera.", price: 320, veg: true, spicy: false },
      { slug: "misir-wot", name: "Misir Wot", description: "Red lentils stewed in berbere and niter kibbeh.", price: 240, veg: true, spicy: true },
    ],
  },
  {
    slug: "drinks",
    name: "Drinks",
    items: [
      { slug: "macchiato", name: "Ethiopian Macchiato", description: "Double shot, steamed milk, served in a small glass.", price: 80, veg: true, spicy: false },
      { slug: "avocado-juice", name: "Avocado & Mango Juice", description: "Layered fresh juice, no added sugar.", price: 140, veg: true, spicy: false },
      { slug: "ambo-water", name: "Ambo Water", description: "Sparkling natural mineral water, 500ml.", price: 60, veg: true, spicy: false },
      { slug: "tej", name: "Tej", description: "Traditional honey wine, served chilled in a berele.", price: 150, veg: true, spicy: false },
    ],
  },
  {
    slug: "desserts",
    name: "Desserts",
    items: [
      { slug: "baklava", name: "Baklava", description: "Layered pastry, walnut filling, honey syrup.", price: 150, veg: true, spicy: false },
      { slug: "fruit-salad", name: "Fruit Salad", description: "Seasonal fruit, mint, a little lime.", price: 130, veg: true, spicy: false },
    ],
  },
].freeze

CATEGORIES.each_with_index do |cat, cat_position|
  category = MenuCategory.find_or_create_by!(slug: cat[:slug]) do |c|
    c.name = cat[:name]
    c.position = cat_position
  end
  category.update!(name: cat[:name], position: cat_position)

  cat[:items].each_with_index do |item, item_position|
    menu_item = category.menu_items.find_or_initialize_by(slug: item[:slug])
    menu_item.assign_attributes(
      name: item[:name],
      description: item[:description],
      price: item[:price],
      veg: item[:veg],
      spicy: item[:spicy],
      available: true,
      position: item_position
    )
    menu_item.save!
  end
end

puts "Seeded #{MenuCategory.count} categories and #{MenuItem.count} menu items."

# A demo admin account so you can log in and use /api/admin/menu_items
# to edit the menu without touching this file again.
if User.find_by(email: "admin@restaurant.test").nil?
  User.create!(
    name: "Admin",
    email: "admin@restaurant.test",
    password: "changeme123",
    role: :admin
  )
  puts "Seeded admin user: admin@restaurant.test / changeme123 (change this password!)"
end
