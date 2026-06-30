class ApplicationController < ActionController::API
  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    return if request.path == "/register"
    return if request.path == "/login"

    header = request.headers["Authorization"]
    return render json: { error: "Missing token" }, status: :unauthorized unless header

    token = header.split(" ").last
    decoded = JsonWebToken.decode(token)

    return render json: { error: "Invalid token" }, status: :unauthorized unless decoded

    @current_user = User.find_by(id: decoded["user_id"])

    return render json: { error: "User not found" }, status: :unauthorized unless @current_user
  end

  def admin_only
    return render json: { error: "Admin only" }, status: :forbidden unless current_user&.role == "admin"
  end
end