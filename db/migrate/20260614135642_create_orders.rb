class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.string :table_number
      t.text :items
      t.string :status

      t.timestamps
    end
  end
end
