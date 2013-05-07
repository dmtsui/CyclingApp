require 'json'

class Gpx < ActiveRecord::Base
  attr_accessible :data, :user_id, :trk_data

  belongs_to :user, inverse_of: :gpxes
  
end


#Gpx
#attrs :version, :creator, :time, :bounds
#has_many :wpts, inverse_of :gpx

