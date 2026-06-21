class Order < ApplicationRecord

  validates :table_number, presence: true
  validates :items, presence: true

  after_create :send_to_rabbitmq

  def publish_food_ready
    puts "FoodReady Event Published for Order ##{id}"
  end

  private

  def send_to_rabbitmq

    return unless defined?(ORDER_QUEUE)

    ORDER_QUEUE.publish(
      {
        order_id: id,
        table_number: table_number,
        items: items,
        status: status,
        created_at: created_at
      }.to_json,
      persistent: true
    )

    puts "Order #{id} published to RabbitMQ"
  end
end