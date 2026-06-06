class GatewayController < ApplicationController

  skip_before_action :authenticate_request, only: [:auth, :tables]

  def auth
    render json: {
      service: "Authentication Service",
      status: "Gateway route active"
    }
  end

  def orders
    render json: {
      error: "Unauthorized"
    }
  end

  def payments
    render json: {
      service: "Payment Service",
      status: "Gateway route active"
    }
  end

  def kitchen
    render json: {
      service: "Kitchen Service",
      status: "Gateway route active"
    }
  end

  def notifications
    render json: {
      service: "Notification Service",
      status: "Gateway route active"
    }
  end

  def tables
    render json: {
      service: "Table Service",
      status: "Gateway route active"
    }
  end

end