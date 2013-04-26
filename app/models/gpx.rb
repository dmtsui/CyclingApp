require 'nokogiri'

class Gpx < ActiveRecord::Base
  attr_accessible :version, :creator, :time
  
  validates :time, :bound, presence: true
  
  has_one :bound, inverse_of: :gpx
  has_many :wpts, inverse_of: :gpx
  
  def self.make(gpx_file)
    gpx_hash = Hash.from_xml(File.open("#{Rails.root}/#{gpx_file}"))
    
    gpx = Gpx.new(creator: gpx_hash["gpx"]["creator"],
                  time: gpx_hash["gpx"]["time"])
    gpx.make_bound(gpx_hash["gpx"]["bounds"])   
    gpx.make_wpts(gpx_hash["gpx"]["wpt"]) if gpx_hash["gpx"]["wpt"][0]


    gpx.save
  end
  
  def make_bound(bounds_hash)
    bounds = { 
      minlat: bounds_hash["minlat"].to_f,
      minlon: bounds_hash["minlon"].to_f,
      maxlat: bounds_hash["maxlat"].to_f,
      maxlon: bounds_hash["maxlon"].to_f
    }
    self.build_bound(bounds)
  end
  
  def make_wpts(wpts_hash)
    wpts_hash.each do |wpt_attrs|
      self.make_wpt(wpt_attrs)
    end
    nil
  end
  
  def make_wpt(wpt_attrs)
    attrs = {
       lat: wpt_attrs["lat"].to_f,
       lon: wpt_attrs["lon"].to_f,
       ele: wpt_attrs["ele"].to_f,
      time: wpt_attrs["time"],
      name: wpt_attrs["name"]      
    }
    self.wpts.build(attrs)
  end
  
  
end


#Gpx
#attrs :version, :creator, :time, :bounds
#has_many :wpts, inverse_of :gpx

