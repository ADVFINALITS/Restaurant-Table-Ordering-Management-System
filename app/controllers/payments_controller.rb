class PaymentsController < ApplicationController

  skip_before_action :authenticate_request

  def create
    order = Order.find(params[:order_id])

    payment = Payment.new(
      order_id: order.id,
      amount: params[:amount],
      payment_method: params[:payment_method],
      status: "successful"
    )

    if payment.save
      render json: {
        message: "Payment successful",
        payment: payment
      }, status: :created
    else
      render json: payment.errors,
             status: :unprocessable_entity
    end
  end

end