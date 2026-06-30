module Api
  class KitchenController < ApplicationController
    # GET /api/kitchen/orders - placed or preparing, oldest first.
    # No auth: the kitchen page is meant to run as a walk-up tablet
    # on the pass, not something the chef logs into.
    def orders
      render json: Order.kitchen_queue.includes(:order_items).map(&:as_order_json)
    end
  end
end
