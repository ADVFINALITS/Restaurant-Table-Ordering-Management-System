require "test_helper"

class Api::MenuControllerTest < ActionDispatch::IntegrationTest
  test "index returns categories with nested available items" do
    get "/api/menu"
    assert_response :success

    body = JSON.parse(response.body)
    mains = body.find { |c| c["id"] == "mains" }
    assert mains
    assert mains["items"].any? { |i| i["id"] == menu_items(:burger).slug }
  end
end

class Api::KitchenControllerTest < ActionDispatch::IntegrationTest
  test "orders returns only placed/preparing tickets" do
    placed = Order.create!(table_number: "1")
    preparing = Order.create!(table_number: "2")
    preparing.advance_to!("preparing")
    paid = Order.create!(table_number: "3")
    paid.update!(status: "paid")

    get "/api/kitchen/orders"
    assert_response :success

    ids = JSON.parse(response.body).map { |o| o["id"] }
    assert_includes ids, placed.public_id
    assert_includes ids, preparing.public_id
    assert_not_includes ids, paid.public_id
  end
end

class Api::WaiterControllerTest < ActionDispatch::IntegrationTest
  test "orders returns only ready/served tickets" do
    ready = Order.create!(table_number: "1")
    ready.update!(status: "ready")
    placed = Order.create!(table_number: "2")

    get "/api/waiter/orders"
    assert_response :success

    ids = JSON.parse(response.body).map { |o| o["id"] }
    assert_includes ids, ready.public_id
    assert_not_includes ids, placed.public_id
  end
end

class Api::TablesControllerTest < ActionDispatch::IntegrationTest
  test "active_order finds an open ticket for the table" do
    order = Order.create!(table_number: "9")

    get "/api/tables/9/active_order"
    assert_response :success
    assert_equal order.public_id, JSON.parse(response.body)["id"]
  end

  test "active_order is 404 when the table has no open ticket" do
    get "/api/tables/9/active_order"
    assert_response :not_found
  end

  test "active_order ignores paid orders" do
    order = Order.create!(table_number: "9")
    order.update!(status: "paid")

    get "/api/tables/9/active_order"
    assert_response :not_found
  end
end
