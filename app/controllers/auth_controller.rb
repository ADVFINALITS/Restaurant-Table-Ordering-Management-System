class AuthController < ApplicationController
end
class AuthController < ApplicationController

  def register
    user = User.new(user_params)

    if user.save
      render json: {
        message: "User registered successfully"
      }, status: :created
    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])

      token = JsonWebToken.encode(
        user_id: user.id,
        role: user.role
      )

      render json: {
        token: token,
        role: user.role
      }
    else
      render json: {
        error: "Invalid email or password"
      }, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(
      :name,
      :email,
      :password,
      :password_confirmation,
      :role
    )
  end
end