require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "register creates a user" do
    post "/register", params: {
      name: "New Admin",
      email: "new-admin@restaurant.test",
      password: "password123",
      password_confirmation: "password123",
      role: "admin",
    }, as: :json

    assert_response :created
    assert User.exists?(email: "new-admin@restaurant.test")
  end

  test "login returns a token for valid credentials" do
    User.create!(name: "Staff", email: "staff@restaurant.test", password: "password123", role: :waiter)

    post "/login", params: { email: "staff@restaurant.test", password: "password123" }, as: :json

    assert_response :success
    body = JSON.parse(response.body)
    assert body["token"].present?
    assert_equal "waiter", body["role"]
  end

  test "login rejects a wrong password" do
    User.create!(name: "Staff", email: "staff@restaurant.test", password: "password123", role: :waiter)

    post "/login", params: { email: "staff@restaurant.test", password: "wrong" }, as: :json
    assert_response :unauthorized
  end

  test "login rejects an unknown email" do
    post "/login", params: { email: "nobody@nowhere.test", password: "whatever" }, as: :json
    assert_response :unauthorized
  end
end
