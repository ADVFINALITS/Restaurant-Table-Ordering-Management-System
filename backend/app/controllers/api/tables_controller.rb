module Api
  class TablesController < ApplicationController
    # GET /api/tables/:table_number/active_order
    # Returns the table's current open ticket, or 404 if it has none -
    # the frontend's apiGetActiveOrderForTable() treats any non-2xx as
    # "no active order" and swallows it (see lib/api.js), so a plain
    # 404 here is exactly what it expects.
    def active_order
      order = Order.active_for_table(params[:table_number])
      return render json: { error: "No active order for this table" }, status: :not_found unless order

      render json: order.as_order_json
    end
  end
end
