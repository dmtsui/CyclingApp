class GpxesController < ApplicationController
  respond_to :json
  respond_to :html, only:[:index]
  
  def index
    @gpxes = Gpx.all
    @gpxes.map! do |gpx| 
      data = JSON.parse(gpx[:data])
      data[:id] = gpx[:id]
      data
    end
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @gpxes }
    end
  end
  
  def create
    @gpx = Gpx.new(params[:gpx])
    if @gpx.save
      render json: JSON.parse(@gpx[:data])
    else
      render json: @gpx.errors, status: 422
    end
  end
  
  def show 
    @gpx = Gpx.find(params[:id])
    render json: JSON.parse(@gpx[:data])
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
