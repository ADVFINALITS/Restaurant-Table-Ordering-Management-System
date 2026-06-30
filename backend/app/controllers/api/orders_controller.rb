module Api
  class OrdersController < ApplicationController
    # POST /api/orders
    # Body: { table_number, note, items: [{ menu_item_id, quantity, notes }] }
    def create
      items_params = Array(params[:items])
      if items_params.empty?
        return render json: { error: "An order needs at least one item" }, status: :unprocessable_entity
      end

      order = Order.new(table_number: params[:table_number], note: params[:note])

      ActiveRecord::Base.transaction do
        order.save!

        items_params.each do |item|
          menu_item = MenuItem.find_by(slug: item[:menu_item_id])

          unless menu_item
            raise ArgumentError, "Unknown menu item: #{item[:menu_item_id].inspect}"
          end

          order.order_items.create!(
            menu_item: menu_item,
            name: menu_item.name,
            price: menu_item.price,
            quantity: item[:quantity].presence || 1,
            notes: item[:notes]
          )
        end
      end

      render json: order.reload.as_order_json, status: :created
    rescue ArgumentError => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end

    # GET /api/orders/:id
    def show
      order = find_order!
      render json: order.as_order_json
    end

    # PATCH /api/orders/:id/status
    # Body: { status }
    def status
      order = find_order!
      order.advance_to!(params[:status])
      render json: order.as_order_json
    rescue ArgumentError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    # POST /api/orders/:id/pay
    # Body: { payment_method }
    def pay
      order = find_order!

      unless order.status == "billed"
        return render json: { error: "Order is not ready to be paid (status: #{order.status})" }, status: :unprocessable_entity
      end

      order.mark_paid!(params[:payment_method])
      render json: order.as_order_json
    end

    private

    def find_order!
      Order.find_by_public_id(params[:id]) ||
        (raise ActiveRecord::RecordNotFound, "No order with id #{params[:id]}")
    end
  end
end
