class CreateMenuItems < ActiveRecord::Migration[8.1]
  def change
    create_table :menu_items do |t|
      t.references :menu_category, null: false, foreign_key: true
      t.string :slug, null: false
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false, default: 0
      t.boolean :veg, null: false, default: false
      t.boolean :spicy, null: false, default: false
      t.boolean :available, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :menu_items, :slug, unique: true
  end
end
