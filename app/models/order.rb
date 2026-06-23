class Order < ApplicationRecord

  validates :table_number, presence: true
  validates :items, presence: true

  after_create :send_to_rabbitmq

  def publish_food_ready
    puts "FoodReady Event Published for Order ##{id}"
  end

  # Generate invoice
  def generate_invoice
    item_list = items.split(",")

    total = item_list.length * 10

    {
      order_id: id,
      table_number: table_number,
      items: item_list,
      total_amount: total
    }
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