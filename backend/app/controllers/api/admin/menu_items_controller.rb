module Api
  module Admin
    class MenuItemsController < ApplicationController
      before_action :authenticate_request
      before_action :admin_only
      before_action :set_menu_item, only: [:update, :destroy]

      # GET /api/admin/menu_items
      def index
        render json: MenuItem.includes(:menu_category).order(:menu_category_id, :position).map(&:as_admin_json)
      end

      # POST /api/admin/menu_items
      # Body: { category_id, name, slug, description, price, veg, spicy, available }
      def create
        category = MenuCategory.find_by!(slug: params[:category_id])
        item = category.menu_items.new(menu_item_params)

        if item.save
          render json: item.as_admin_json, status: :created
        else
          render json: { error: item.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # PATCH /api/admin/menu_items/:id
      def update
        if @menu_item.update(menu_item_params)
          render json: @menu_item.as_admin_json
        else
          render json: { error: @menu_item.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/admin/menu_items/:id
      def destroy
        @menu_item.destroy
        head :no_content
      end

      private

      def set_menu_item
        @menu_item = MenuItem.find(params[:id])
      end

      def menu_item_params
        params.permit(:name, :slug, :description, :price, :veg, :spicy, :available, :position)
      end
    end
  end
end
