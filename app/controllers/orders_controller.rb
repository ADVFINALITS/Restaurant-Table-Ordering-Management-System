class OrdersController < ApplicationController

  skip_before_action :authenticate_request

  def index
    render json: Order.all
  end

  def show
    order = Order.find(params[:id])
    render json: order
  end

  def create
    order = Order.new(order_params)
    order.status = "pending"

    if order.save
      render json: order, status: :created
    else
      render json: order.errors, status: :unprocessable_entity
    end
  end

  private

  def order_params
    params.require(:order).permit(
      :table_number,
      :items
    )
  end
end