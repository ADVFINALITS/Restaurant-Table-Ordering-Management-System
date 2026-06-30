require "test_helper"

class OrderTest < ActiveSupport::TestCase
  test "order requires table number" do
    order = Order.new
    assert_not order.valid?
    assert_includes order.errors[:table_number], "can't be blank"
  end

  test "valid order should pass and default to placed status" do
    order = Order.new(table_number: "7")
    assert order.valid?
    order.save!
    assert_equal "placed", order.status
    assert_not_nil order.placed_at
  end

  test "compute_bill matches the documented example" do
    order = Order.create!(table_number: "7")
    order.order_items.create!(name: "Doro Wat", price: 420, quantity: 2)

    bill = order.compute_bill

    assert_equal 840, bill[:subtotal]
    assert_equal 84, bill[:service_charge]
    assert_equal 139, bill[:tax]
    assert_equal 1063, bill[:total]
  end

  test "advancing to served computes the bill and jumps straight to billed" do
    order = Order.create!(table_number: "7")
    order.order_items.create!(name: "Doro Wat", price: 420, quantity: 2)

    order.advance_to!("served")

    assert_equal "billed", order.status
    assert_not_nil order.served_at
    assert_not_nil order.billed_at
    assert_equal 1063, order.total.to_i
  end

  test "mark_paid! sets status, payment_method and paid_at" do
    order = Order.create!(table_number: "7")
    order.order_items.create!(name: "Doro Wat", price: 420, quantity: 1)
    order.advance_to!("served")

    order.mark_paid!("cash")

    assert_equal "paid", order.status
    assert_equal "cash", order.payment_method
    assert_not_nil order.paid_at
  end

  test "as_order_json matches the documented Order shape" do
    order = Order.create!(table_number: "7", note: "no onions")
    order.order_items.create!(name: "Doro Wat", price: 420, quantity: 1, notes: "extra spicy")

    json = order.as_order_json

    assert_equal order.public_id, json[:id]
    assert_equal "7", json[:table_number]
    assert_equal "placed", json[:status]
    assert_equal "no onions", json[:note]
    assert_nil json[:bill]
    assert_equal 1, json[:items].length
    assert_equal "extra spicy", json[:items].first[:notes]
  end
end
