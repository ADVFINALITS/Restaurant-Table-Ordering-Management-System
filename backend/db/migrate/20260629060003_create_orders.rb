class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.string :table_number, null: false
      t.string :status, null: false, default: "placed"
      t.text :note

      # Bill, computed and frozen once the order is served/billed.
      t.decimal :subtotal, precision: 10, scale: 2
      t.decimal :service_charge_rate, precision: 5, scale: 4
      t.decimal :service_charge, precision: 10, scale: 2
      t.decimal :tax_rate, precision: 5, scale: 4
      t.decimal :tax, precision: 10, scale: 2
      t.decimal :total, precision: 10, scale: 2
      t.string :currency, null: false, default: "ETB"

      t.string :payment_method

      # One column per lifecycle step (placed -> preparing -> ready ->
      # served -> billed -> paid), matching lib/orderStatus.js exactly.
      t.datetime :placed_at
      t.datetime :preparing_at
      t.datetime :ready_at
      t.datetime :served_at
      t.datetime :billed_at
      t.datetime :paid_at

      t.timestamps
    end

    add_index :orders, :table_number
    add_index :orders, :status
  end
end
