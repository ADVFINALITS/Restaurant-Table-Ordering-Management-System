class TablesController < ApplicationController

  skip_before_action :authenticate_request

  before_action :set_table, only: [:show, :update, :destroy]

  def index
    render json: Table.all
  end

  def show
    render json: @table
  end

  def create
    table = Table.new(table_params)

    if table.save
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