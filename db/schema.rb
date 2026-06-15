# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_14_191243) do
  create_table "cart_items", force: :cascade do |t|
    t.integer "cart_id", null: false
    t.datetime "created_at", null: false
    t.integer "menu_item_id", null: false
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["menu_item_id"], name: "index_cart_items_on_menu_item_id"
  end

  create_table "carts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "table_number"
    t.datetime "updated_at", null: false
  end

  create_table "menu_items", force: :cascade do |t|
    t.boolean "available"
    t.string "category"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name"
    t.decimal "price"
    t.datetime "updated_at", null: false
  end

  create_table "orders", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "items"
    t.string "status"
    t.string "table_number"
    t.datetime "updated_at", null: false
  end

  create_table "tables", force: :cascade do |t|
    t.integer "capacity"
    t.datetime "created_at", null: false
    t.string "qr_code"
    t.text "qr_svg"
    t.string "qr_url"
    t.string "status"
    t.string "table_number"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.integer "role"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "menu_items"
end
