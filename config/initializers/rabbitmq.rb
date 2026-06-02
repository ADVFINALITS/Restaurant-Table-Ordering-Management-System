require "bunny"

conn = Bunny.new(hostname: "localhost")
conn.start

channel = conn.create_channel

ORDER_QUEUE = channel.queue("orders", durable: true)

puts "RabbitMQ connected successfully!"