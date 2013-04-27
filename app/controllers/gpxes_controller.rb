class GpxesController < ApplicationController
  respond_to :json
  respond_to :html, only:[:index]
  
  def index
    @gpxes = Gpx.all
    
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @gpxes }
    end
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
    p @gpx.to_json
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
