class AddTrackData < ActiveRecord::Migration
  def change
    add_column :gpxes, :trk_data, :text
  end
end
