class OrderPublisher
  def self.publish(order)
    conn = Bunny.new(hostname: "localhost")
    conn.start

    ch = conn.create_channel
    queue = ch.queue("orders", durable: true)

    queue.publish(
      {
        id: order.id,
        table_number: order.table_number,
        status: order.status
      }.to_json,
      persistent: true
    )

    conn.close
  end
end