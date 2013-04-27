require 'json'

class Gpx < ActiveRecord::Base
  attr_accessible :data
  
  before_save :make_json
  
  #validates :data, presence: true
  
  def make_json
    raw_data = Hash.from_xml(File.open("#{Rails.root}/fells_loop.gpx"))
    clean_data = {
      version: raw_data["gpx"]["version"],
      creator: raw_data["gpx"]["creator"],
         time: raw_data["gpx"]["time"],
        bound: raw_data["gpx"]["bounds"]
    }
    clean_data[:wpts] = raw_data["gpx"]["wpt"] if raw_data["gpx"]["wpt"]
    clean_data[:rtes] = raw_data["gpx"]["rtes"] if raw_data["gpx"]["rtes"]

    self.data = clean_data.to_json
  end
end


#Gpx
#attrs :version, :creator, :time, :bounds
#has_many :wpts, inverse_of :gpx

