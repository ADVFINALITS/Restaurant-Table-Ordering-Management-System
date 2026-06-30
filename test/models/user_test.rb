require "test_helper"

class UserTest < ActiveSupport::TestCase

  test "user should be valid" do
    user = User.new(
      name: "Admin",
      email: "admin@test.com",
      password: "password123",
      role: :admin
    )

    assert user.valid?
  end

  test "user requires email" do
    user = User.new(
      name: "Admin",
      password: "password123",
      role: :admin
    )

    assert_not user.valid?
  end

end