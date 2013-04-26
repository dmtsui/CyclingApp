class Wpt < ActiveRecord::Base
  attr_accessible :lat, :lon, :ele, :time, :name, :gpx_id
  
  # validates :lat, :lon, :ele, :time, :name, :gpx, presence: true
  
  belongs_to :gpx, inverse_of: :wpts
end

#Wpt
#attr :lat, :lon, :ele, :time, :name, :gpx_id
#belongs_to :gpx, inverse_of: wpts