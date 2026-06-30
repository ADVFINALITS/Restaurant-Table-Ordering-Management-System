require "test_helper"

class Api::OrdersControllerTest < ActionDispatch::IntegrationTest
  test "create rejects an order with no items" do
    post "/api/orders", params: { table_number: "7", items: [] }, as: :json
    assert_response :unprocessable_entity
  end

  test "create rejects an unknown menu item" do
    post "/api/orders", params: { table_number: "7", items: [{ menu_item_id: "nope", quantity: 1 }] }, as: :json
    assert_response :unprocessable_entity
  end

  test "full order lifecycle: placed -> preparing -> ready -> served/billed -> paid" do
    post "/api/orders", params: {
      table_number: "7",
      note: "birthday",
      items: [{ menu_item_id: menu_items(:burger).slug, quantity: 2, notes: "no pickles" }],
    }, as: :json
    assert_response :created

    order_id = JSON.parse(response.body)["id"]
    assert_match(/\Aord_\d+\z/, order_id)

    get "/api/orders/#{order_id}"
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "placed", body["status"]
    assert_nil body["bill"]

    patch "/api/orders/#{order_id}/status", params: { status: "preparing" }, as: :json
    assert_response :success
    assert_equal "preparing", JSON.parse(response.body)["status"]

    patch "/api/orders/#{order_id}/status", params: { status: "ready" }, as: :json
    assert_response :success
    assert_equal "ready", JSON.parse(response.body)["status"]

    # Serving jumps straight to "billed" with the bill populated, in
    # the same request - see Order#advance_to!.
    patch "/api/orders/#{order_id}/status", params: { status: "served" }, as: :json
    assert_response :success
    served_body = JSON.parse(response.body)
    assert_equal "billed", served_body["status"]
    assert_not_nil served_body["bill"]
    assert_equal 20.0, served_body["bill"]["subtotal"]

    post "/api/orders/#{order_id}/pay", params: { payment_method: "cash" }, as: :json
    assert_response :success
    paid_body = JSON.parse(response.body)
    assert_equal "paid", paid_body["status"]
    assert_equal "cash", paid_body["payment_method"]
  end

  test "pay is rejected before the order has been billed" do
    post "/api/orders", params: {
      table_number: "7",
      items: [{ menu_item_id: menu_items(:burger).slug, quantity: 1 }],
    }, as: :json
    order_id = JSON.parse(response.body)["id"]

    post "/api/orders/#{order_id}/pay", params: { payment_method: "cash" }, as: :json
    assert_response :unprocessable_entity
  end

  test "show returns 404 for an unknown order" do
    get "/api/orders/ord_999999"
    assert_response :not_found
  end
end
