module Api
  class OrdersController < ApplicationController
    before_action :admin_only, only: [:index]

    def index
      render json: {
        message: "Orders fetched successfully",
        user: current_user.email,
        role: current_user.role
      }
    end

    def create
      render json: {
        message: "Order created",
        user_id: current_user.id
      }
    end
  end
end