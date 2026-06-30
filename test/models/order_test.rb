require "test_helper"

class OrderTest < ActiveSupport::TestCase

  test "order requires table number" do
    order = Order.new(
      items: "Burger"
    )

    assert_not order.valid?
  end

  test "order requires items" do
    order = Order.new(
      table_number: "T1"
    )

    assert_not order.valid?
  end

  test "valid order should pass" do
    order = Order.new(
      table_number: "T1",
      items: "Burger, Coke"
    )

    assert order.valid?
  end

end