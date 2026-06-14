class AddQrSvgToTables < ActiveRecord::Migration[8.1]
  def change
    add_column :tables, :qr_svg, :text
  end
end
