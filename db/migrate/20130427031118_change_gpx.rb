class ChangeGpx < ActiveRecord::Migration
  def change
    remove_column :gpxes, :version
    remove_column :gpxes, :creator
    remove_column :gpxes, :time
    
    add_column :gpxes, :data, :text
    
  end
end
