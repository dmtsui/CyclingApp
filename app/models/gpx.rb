require 'json'

class Gpx < ActiveRecord::Base
  attr_accessible :data, :user_id
  
  before_save :make_json

  belongs_to :user, inverse_of: :gpxes
  
  
  def make_json
    raw_data = Hash.from_xml(self.data)
    clean_data = {
      version: raw_data["gpx"]["version"],
      creator: raw_data["gpx"]["creator"],
         time: raw_data["gpx"]["time"]
        # bound: raw_data["gpx"]["bounds"]
    }
    # if raw_data["gpx"]["wpt"]
    #   clean_data[:wpts] = raw_data["gpx"]["wpt"]
    # end
    
    # if raw_data["gpx"]["rte"]
    #   clean_data[:rtes] = raw_data["gpx"]["rte"]
    #   clean_data[:rtes][:rtepts] =  raw_data["gpx"]["rte"]["rtept"]
    #   clean_data[:rtes].delete("rtept")
    # end
    if raw_data["gpx"]["trk"]
      raw_data['gpx']['trk']['trkseg']['trkpts'] = raw_data['gpx']['trk']['trkseg']['trkpt'].dup
      raw_data['gpx']['trk']['trkseg'].delete('trkpt')
      clean_data[:trk] = raw_data["gpx"]["trk"]
    end

    self.data = clean_data.to_json
  end
end


#Gpx
#attrs :version, :creator, :time, :bounds
#has_many :wpts, inverse_of :gpx

