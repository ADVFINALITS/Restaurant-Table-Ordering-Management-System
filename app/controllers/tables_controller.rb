require "rqrcode"

class TablesController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show, :menu, :scan]
  before_action :authenticate_request, only: [:create, :update, :destroy]
  before_action :set_table, only: [:show, :update, :destroy, :menu]

  def index
    render json: Table.all
  end

  def show
    render json: @table
  end

  def menu
    menu_items = MenuItem.where(available: true)
    render json: {
      table: @table,
      menu_items: menu_items.group_by(&:category)
    }
  end

  def scan
    table = Table.find_by(id: params[:id])
    if table
      render json: { qr_url: table.qr_url, qr_svg: table.qr_svg }
    else
      render json: { error: "Table not found" }, status: :not_found
    end
  end

  def create
    table = Table.new(table_params)
    if table.save
      qr_url = "http://localhost:3000/tables/#{table.id}/menu"
      qr = RQRCode::QRCode.new(qr_url)
      svg = qr.as_svg(
        offset: 0,
        color: "000",
        shape_rendering: "crispEdges",
        module_size: 4
      )
      table.update(
        qr_code: SecureRandom.uuid,
        qr_url: qr_url,
        qr_svg: svg
      )
      render json: table, status: :created
    else
      render json: table.errors, status: :unprocessable_entity
    end
  end

  def update
    if @table.update(table_params)
      render json: @table
    else
      render json: @table.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @table.destroy
    head :no_content
  end

  private

  def set_table
    @table = Table.find(params[:id])
  end

  def table_params
    params.require(:table).permit(
      :table_number,
      :capacity,
      :status
    )
  end
end