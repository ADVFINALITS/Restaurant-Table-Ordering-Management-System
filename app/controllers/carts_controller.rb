class CartsController < ApplicationController

  skip_before_action :authenticate_request

  def create
    cart = Cart.create(
      table_number: params[:table_number]
    )

    render json: cart
  end

  def add_item
    cart = Cart.find(params[:id])

    item = cart.cart_items.create(
      menu_item_id: params[:menu_item_id],
      quantity: params[:quantity]
    )

    render json: item
  end

  def update_item
    item = CartItem.find(params[:cart_item_id])

    item.update(
      quantity: params[:quantity]
    )

    render json: item
  end

  def remove_item
    item = CartItem.find(params[:cart_item_id])

    item.destroy

    render json: {
      message: "Item removed"
    }
  end

end