class AddQrToTables < ActiveRecord::Migration[8.1]
  def change
    add_column :tables, :qr_code, :string
    add_column :tables, :qr_url, :string
  end
end
