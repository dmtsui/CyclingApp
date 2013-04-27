class WptsController < ApplicationController
  respond_to :json
  
  def index
    @wpts = Gpx.find(params[:gpx_id]).wpts
    render json: @wpts
  end
  
  def create
    @wpt = Wpt.new(params[:wpt])
    if @wpt.save
      render json: @wpt
    else
      render json: @wpt.errors, status: 422
    end
  end
  
  def show 
    @wpt = Wpt.find(params[:id])
    render json: @wpt
  end
  
  def destroy
    @wpt = Wpt.find(params[:id])
    if @wpt.destroy
      redirect_to wptes_url
    else
      render json: @wpt.errors, status: 422
    end
  end
  
end
