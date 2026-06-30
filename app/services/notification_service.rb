class NotificationService

  def self.notify_waiter(order)
    puts "========================"
    puts "WAITER NOTIFICATION"
    puts "Order ##{order.id}"
    puts "Table #{order.table_number}"
    puts "Food is ready"
    puts "========================"
  end

  def self.notify_customer(order)
    puts "========================"
    puts "CUSTOMER NOTIFICATION"
    puts "Order ##{order.id}"
    puts "Table #{order.table_number}"
    puts "Your food is ready"
    puts "========================"
  end

  def self.notify_chef(order)
    puts "========================"
    puts "CHEF NOTIFICATION"
    puts "New Order ##{order.id}"
    puts "Table #{order.table_number}"
    puts "Please start preparing the food"
    puts "========================"
  end

end