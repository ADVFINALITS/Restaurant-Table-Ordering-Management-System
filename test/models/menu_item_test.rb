require "test_helper"

class MenuItemTest < ActiveSupport::TestCase

  test "menu item can be created" do
    item = MenuItem.new(
      name: "Burger",
      description: "Beef Burger",
      price: 10,
      category: "Food",
      available: true
    )

    assert item.valid?
  end

end