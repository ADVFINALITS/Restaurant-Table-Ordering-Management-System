require "test_helper"

class PaymentTest < ActiveSupport::TestCase

  test "payment requires amount" do
    payment = Payment.new(
      payment_method: "Cash",
      status: "successful"
    )

    assert_not payment.valid?
  end

  test "payment requires payment method" do
    payment = Payment.new(
      amount: 20,
      status: "successful"
    )

    assert_not payment.valid?
  end

  test "valid payment should pass" do
    order = Order.create!(
      table_number: "T1",
      items: "Burger, Coke",
      status: "pending"
    )

    payment = Payment.new(
      order: order,
      amount: 20,
      payment_method: "Cash",
      status: "successful"
    )

    assert payment.valid?
  end

end