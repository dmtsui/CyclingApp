class CreateWpts < ActiveRecord::Migration
  def change
    create_table :wpts do |t|
      t.float     :lat
      t.float     :lon
      t.float     :ele
      t.datetime  :time
      t.string    :name
      t.integer   :gpx_id
      t.timestamps
    end
    add_index :wpts, :gpx_id
  end
end

#Wpt
#attr :lat, :lon, :ele, :time, :name, :gpx_id
#belongs_to :gpx, inverse_of: wpts