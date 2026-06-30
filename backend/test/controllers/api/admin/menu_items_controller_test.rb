require "test_helper"

class Api::Admin::MenuItemsControllerTest < ActionDispatch::IntegrationTest
  def admin_token
    admin = User.create!(name: "Admin", email: "admin@restaurant.test", password: "password123", role: :admin)
    JsonWebToken.encode(user_id: admin.id, role: admin.role)
  end

  test "index requires authentication" do
    get "/api/admin/menu_items"
    assert_response :unauthorized
  end

  test "index works with a valid admin token" do
    get "/api/admin/menu_items", headers: { "Authorization" => "Bearer #{admin_token}" }
    assert_response :success
  end

  test "create adds a new item under an existing category" do
    post "/api/admin/menu_items",
      params: { category_id: menu_categories(:mains).slug, name: "Pizza", slug: "pizza", price: 15 },
      headers: { "Authorization" => "Bearer #{admin_token}" },
      as: :json

    assert_response :created
    assert MenuItem.exists?(slug: "pizza")
  end

  test "non-admin users are forbidden" do
    waiter = User.create!(name: "Waiter", email: "waiter@restaurant.test", password: "password123", role: :waiter)
    token = JsonWebToken.encode(user_id: waiter.id, role: waiter.role)

    get "/api/admin/menu_items", headers: { "Authorization" => "Bearer #{token}" }
    assert_response :forbidden
  end
end
