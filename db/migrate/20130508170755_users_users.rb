class UsersUsers < ActiveRecord::Migration
  def change
    create_table :users_users do |t|
      t.integer :this_user_id
      t.integer :other_user_id

      t.timestamps
    end
    
    add_index :users_users, :this_user_id
    add_index :users_users, :other_user_id
  end
    
end
