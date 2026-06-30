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

ActiveRecord::Schema[8.1].define(version: 2026_06_29_060004) do
  create_table "menu_categories", force: :cascade do |t|
    t.string "slug", null: false
    t.string "name", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_menu_categories_on_slug", unique: true
  end

  create_table "menu_items", force: :cascade do |t|
    t.integer "menu_category_id", null: false
    t.string "slug", null: false
    t.string "name", null: false
    t.text "description"
    t.decimal "price", precision: 10, scale: 2, default: "0.0", null: false
    t.boolean "veg", default: false, null: false
    t.boolean "spicy", default: false, null: false
    t.boolean "available", default: true, null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_category_id"], name: "index_menu_items_on_menu_category_id"
    t.index ["slug"], name: "index_menu_items_on_slug", unique: true
  end

  create_table "order_items", force: :cascade do |t|
    t.integer "order_id", null: false
    t.integer "menu_item_id"
    t.string "name", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "quantity", default: 1, null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_item_id"], name: "index_order_items_on_menu_item_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string "table_number", null: false
    t.string "status", default: "placed", null: false
    t.text "note"
    t.decimal "subtotal", precision: 10, scale: 2
    t.decimal "service_charge_rate", precision: 5, scale: 4
    t.decimal "service_charge", precision: 10, scale: 2
    t.decimal "tax_rate", precision: 5, scale: 4
    t.decimal "tax", precision: 10, scale: 2
    t.decimal "total", precision: 10, scale: 2
    t.string "currency", default: "ETB", null: false
    t.string "payment_method"
    t.datetime "placed_at"
    t.datetime "preparing_at"
    t.datetime "ready_at"
    t.datetime "served_at"
    t.datetime "billed_at"
    t.datetime "paid_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_orders_on_status"
    t.index ["table_number"], name: "index_orders_on_table_number"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.integer "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "menu_items", "menu_categories"
  add_foreign_key "order_items", "menu_items"
  add_foreign_key "order_items", "orders"
end
