class User < ApplicationRecord
  has_secure_password

  enum :role, {
    admin: 0,
    waiter: 1
  }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end