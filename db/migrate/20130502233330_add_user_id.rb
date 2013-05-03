class AddUserId < ActiveRecord::Migration
  def change
    add_column :gpxes, :user_id, :integer
    add_index :gpxes, :user_id
  end
end
