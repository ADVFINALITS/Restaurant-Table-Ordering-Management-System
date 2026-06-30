module Api
  class MenuController < ApplicationController
    # GET /api/menu - public, no auth. Every diner who scans a table's
    # QR code hits this before they've ever logged into anything.
    def index
      render json: MenuCategory.ordered.includes(:menu_items).map(&:as_menu_json)
    end
  end
end
