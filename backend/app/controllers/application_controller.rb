class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  attr_reader :current_user

  private

  def render_not_found
    render json: { error: "Not found" }, status: :not_found
  end

  # Opt-in only: controllers that need a logged-in user add
  # `before_action :authenticate_request` themselves (see
  # Api::Admin::BaseController). It is intentionally *not* a global
  # filter here, because none of the diner / kitchen / waiter
  # endpoints documented in restaurant-frontend/README.md ever send
  # an Authorization header - a diner who just scanned a QR code has
  # no account to log into, and the kitchen/waiter boards are meant
  # to run as walk-up tablets on the floor.
  def authenticate_request
    header = request.headers["Authorization"]
    return render json: { error: "Missing token" }, status: :unauthorized unless header

    token = header.split(" ").last
    decoded = JsonWebToken.decode(token)
    return render json: { error: "Invalid token" }, status: :unauthorized unless decoded

    @current_user = User.find_by(id: decoded["user_id"])
    render json: { error: "User not found" }, status: :unauthorized unless @current_user
  end

  def admin_only
    render json: { error: "Admin only" }, status: :forbidden unless current_user&.admin?
  end
end
