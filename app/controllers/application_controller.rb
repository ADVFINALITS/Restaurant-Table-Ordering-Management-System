require "jwt"

class ApplicationController < ActionController::API

  before_action :authenticate_request

  private

  def authenticate_request
    return if request.path.include?("/api/auth")

    token = request.headers["Authorization"]

    unless token
      render json: {
        error: "Unauthorized"
      }, status: :unauthorized
    end
  end

end