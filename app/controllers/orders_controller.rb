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
      render json: order.errors,
             status: :unprocessable_entity
    end
  end

  def ready
  order = Order.find(params[:id])

  order.update(status: "ready")

  order.publish_food_ready

  NotificationService.notify_waiter(order)

  render json: {
    message: "Food is ready",
    table_number: order.table_number,
    order_id: order.id,
    status: order.status
  }
end


  def served
    order = Order.find(params[:id])

    order.update(status: "served")

    render json: {
      message: "Food served successfully",
      table_number: order.table_number,
      order_id: order.id,
      status: order.status
    }
  end

  private

  def order_params
    params.require(:order)
          .permit(:table_number, :items)
  end

end