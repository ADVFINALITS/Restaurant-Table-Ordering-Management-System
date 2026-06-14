class Api::MenuItemsController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]
  before_action :authenticate_request, only: [:create, :update, :destroy]
  before_action :admin_only, only: [:create, :update, :destroy]
  before_action :set_menu_item, only: [:show, :update, :destroy]
  # GET /api/menu_items
  def index
    @menu_items = MenuItem.all
    render json: @menu_items
  end

  # GET /api/menu_items/:id
  def show
    render json: @menu_item
  end

  # POST /api/menu_items
  def create
    @menu_item = MenuItem.new(menu_item_params)
    if @menu_item.save
      render json: @menu_item, status: :created
    else
      render json: { errors: @menu_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/menu_items/:id
  def update
    if @menu_item.update(menu_item_params)
      render json: @menu_item
    else
      render json: { errors: @menu_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/menu_items/:id
  def destroy
    @menu_item.destroy
    render json: { message: "Menu item deleted successfully" }
  end

  private

  def set_menu_item
    @menu_item = MenuItem.find(params[:id])
  end

  def menu_item_params
    params.require(:menu_item).permit(:name, :description, :price, :category, :available)
  end
end