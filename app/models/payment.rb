class Payment < ApplicationRecord
  belongs_to :order

  validates :amount, presence: true
  validates :payment_method, presence: true
  validates :status, presence: true

  after_create :publish_payment_successful

  def publish_payment_successful
    puts "PaymentSuccessful Event Published for Payment ##{id}"

    order.update(status: "paid")
  end
end