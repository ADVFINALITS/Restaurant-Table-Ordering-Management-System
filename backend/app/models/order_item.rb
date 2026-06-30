class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :menu_item, optional: true

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }

  def line_total
    price * quantity
  end

  # { menu_item_id, name, price, quantity, notes } - see
  # restaurant-frontend/README.md "Data shapes" -> Order.items.
  # menu_item_id is the *slug*, matching what the frontend sent in
  # when it created the order, not the internal numeric foreign key.
  def as_order_json
    {
      menu_item_id: menu_item&.slug,
      name: name,
      price: price.to_f,
      quantity: quantity,
      notes: notes,
    }
  end
end
