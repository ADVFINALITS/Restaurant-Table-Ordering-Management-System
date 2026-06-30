module Api
  class WaiterController < ApplicationController
    # GET /api/waiter/orders - ready (or recently served), oldest
    # first. Same no-auth reasoning as the kitchen board.
    def orders
      render json: Order.waiter_queue.includes(:order_items).map(&:as_order_json)
    end
  end
end
