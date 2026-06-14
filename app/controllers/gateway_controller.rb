class GatewayController < ApplicationController
  # 🔐 Orders: only logged-in users (admin or waiter)
  before_action :authenticate_request, only: [:orders, :kitchen, :notifications, :payments]
  # 👑 Payments: admin only
  before_action :admin_only, only: [:payments]
  # 🌐 Public routes
  skip_before_action :authenticate_request, only: [:auth, :tables]

  def auth
    render json: {
      service: "Authentication Service",
      status: "Gateway route active"
    }
  end

  def orders
    render json: {
      message: "Orders service is reachable",
      user: current_user&.email,
      role: current_user&.role
    }
  end

  def payments
    render json: {
      service: "Payment Service",
      status: "Admin only access",
      user: current_user.email,
      role: current_user.role
    }
  end

  def kitchen
    render json: {
      service: "Kitchen Service",
      status: "Accessible to authenticated users",
      user: current_user.email,
      role: current_user.role
    }
  end

  def notifications
    render json: {
      service: "Notification Service",
      status: "Accessible to authenticated users",
      user: current_user.email,
      role: current_user.role
    }
  end

  def tables
    render json: {
      service: "Table Service",
      status: "Gateway route active"
    }
  end
end