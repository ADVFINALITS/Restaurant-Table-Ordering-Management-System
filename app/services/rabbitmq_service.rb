class RabbitmqService
  def self.channel
    @channel ||= begin
      conn = Bunny.new(hostname: "localhost")
      conn.start
      conn.create_channel
    end
  end

  def self.queue
    @queue ||= channel.queue("orders")
  end

  def self.publish(message)
    queue.publish(message.to_json)
  end
end