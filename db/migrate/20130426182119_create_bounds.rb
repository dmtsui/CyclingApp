class CreateBounds < ActiveRecord::Migration
  def change
    create_table :bounds do |t|
      t.float   :minlat
      t.float   :minlon
      t.float   :maxlat
      t.float   :maxlon
      t.integer :gpx_id

      t.timestamps
    end
    add_index :bounds, :gpx_id
  end
end


#Bound
#attr :minlat, :minlon, :maxlat, :maxlon
#belongs_to :gpx
