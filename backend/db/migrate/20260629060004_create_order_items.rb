class CreateOrderItems < ActiveRecord::Migration[8.1]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      # Nullable on purpose: a menu item can be edited or deleted later
      # without ever changing what a past order says it contained.
      t.references :menu_item, null: true, foreign_key: true

      # Snapshotted at order time, so price changes to the menu never
      # change the price of an order that was already placed.
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :quantity, null: false, default: 1
      t.text :notes

      t.timestamps
    end
  end
end
