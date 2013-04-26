class CreateGpxes < ActiveRecord::Migration
  def change
    create_table :gpxes do |t|
      t.string :version
      t.string :creator
      t.datetime :time, null: false

      t.timestamps
    end
  end
end

#Gpx
#attrs :version, :creator, :time
#has_many :wpts, inverse_of :gpx
