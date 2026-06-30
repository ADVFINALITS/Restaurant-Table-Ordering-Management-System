class CreatePayments < ActiveRecord::Migration[8.1]
  def change
    create_table :payments do |t|
      t.integer :order_id
      t.decimal :amount
      t.string :status
      t.string :payment_method

      t.timestamps
    end
  end
end
