class CreateTables < ActiveRecord::Migration[8.1]
  def change
    create_table :tables do |t|
      t.string :table_number
      t.integer :capacity
      t.string :status

      t.timestamps
    end
  end
end
