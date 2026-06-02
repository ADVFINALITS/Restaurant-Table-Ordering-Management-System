class Order < ApplicationRecord
  after_create :send_to_rabbitmq

  def send_to_rabbitmq
    RabbitmqService.publish({
      order_id: id,
      table: table_number,
      items: items,
      status: "pending",
      created_at: created_at
    })
  end
end