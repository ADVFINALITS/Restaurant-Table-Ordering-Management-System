class Order < ApplicationRecord

  after_create :send_to_rabbitmq

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