class BoundsController < ApplicationController
  respond_to :json
  
  def index
    @bounds = Bound.all
    render json: @bounds
  end
  
  def create
    @bound = Bound.new(params[:bound])
    if @bound.save
      render json: @bound
    else
      render json: @bound.errors, status: 422
    end
  end
  
  def show 
    @bound = Bound.find(params[:id])
    render json: @bound
  end
  
  def destroy
    @bound = Bound.find(params[:id])
    if @bound.destroy
      redirect_to boundes_url
    else
      render json: @bound.errors, status: 422
    end
  end
end
