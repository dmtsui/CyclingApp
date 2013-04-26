class GpxesController < ApplicationController
  respond_to :json
  
  def index
    @gpxes = Gpx.includes(:wpts).includes(:bound).all
    render json: @gpxes
  end
  
  def create
    @gpx = Gpx.new(params[:gpx])
    if @gpx.save
      render json: @gpx
    else
      render json: @gpx.errors, status: 422
    end
  end
  
  def show 
    @gpx = Gpx.find(params[:id])
    render json: @gpx
  end
  
  def destroy
    @gpx = Gpx.find(params[:id])
    if @gpx.destroy
      redirect_to gpxes_url
    else
      render json: @gpx.errors, status: 422
    end
  end
  
end
