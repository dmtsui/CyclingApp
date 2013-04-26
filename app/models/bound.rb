class Bound < ActiveRecord::Base
  attr_accessible :minlat, :minlon, :maxlat, :maxlon, :gpx_id
  
  validates :minlat, :minlon, :maxlat, :maxlon, :gpx, presence: true
  
  belongs_to :gpx, inverse_of: :bound
end

#Bound
#attr :minlat, :minlon, :maxlat, :maxlon
#belongs_to :gpx
