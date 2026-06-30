require "test_helper"

class MenuItemTest < ActiveSupport::TestCase
  test "menu item can be created with a category" do
    item = MenuItem.new(
      menu_category: menu_categories(:mains),
      slug: "fries",
      name: "Fries",
      description: "Crispy fries",
      price: 5,
      available: true
    )

    assert item.valid?
  end

  test "menu item requires a unique slug" do
    item = MenuItem.new(
      menu_category: menu_categories(:mains),
      slug: menu_items(:burger).slug,
      name: "Another Burger",
      price: 5
    )

    assert_not item.valid?
    assert_includes item.errors[:slug], "has already been taken"
  end

  test "as_menu_json matches the documented MenuItem shape" do
    item = menu_items(:burger)
    json = item.as_menu_json

    assert_equal item.slug, json[:id]
    assert_equal item.name, json[:name]
    assert_equal item.price.to_f, json[:price]
    assert_equal item.veg, json[:veg]
    assert_equal item.spicy, json[:spicy]
    assert_equal item.available, json[:available]
  end
end
