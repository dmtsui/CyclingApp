class GpxesController < ApplicationController
  before_filter :authenticate_user!
  
  respond_to :json
  respond_to :html, only:[:index]
  
  def index
    @gpxes = current_user.gpxes.all
    @gpxes.map! do |gpx| 
      data = JSON.parse(gpx[:data])
      data.delete('trk')
      data[:id] = gpx[:id]
      data
    end
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @gpxes }
    end
  end
  
  def create
    @gpx = current_user.gpxes.build()
    @gpx.data = params['data']

    if @gpx.save
      data = JSON.parse(@gpx[:data])
      data[:id] = @gpx[:id]
      render json: data
    else
      render json: @gpx.errors, status: 422
    end
  end
  
  def show 
    @gpx = Gpx.find(params[:id])
    data = JSON.parse(@gpx[:data])
    data[:id] = @gpx[:id]
    #debugger
    render json: data
  end
  
  def destroy
    @gpx = current_user.gpxes.where(id: params[:id])
    if @gpx.destroy
      redirect_to gpxes_url
    else
      render json: @gpx.errors, status: 422
    end
  end
  
end
