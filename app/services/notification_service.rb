class NotificationService

  def self.notify_waiter(order)
    puts "========================"
    puts "WAITER NOTIFICATION"
    puts "Order ##{order.id}"
    puts "Table #{order.table_number}"
    puts "Food is ready"
    puts "========================"
  end

end