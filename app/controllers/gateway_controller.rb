class GatewayController < ApplicationController

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

end