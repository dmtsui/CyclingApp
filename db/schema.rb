# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130508170755) do

  create_table "bounds", :force => true do |t|
    t.float    "minlat"
    t.float    "minlon"
    t.float    "maxlat"
    t.float    "maxlon"
    t.integer  "gpx_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "bounds", ["gpx_id"], :name => "index_bounds_on_gpx_id"

  create_table "gpxes", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.text     "data"
    t.integer  "user_id"
    t.text     "trk_data"
  end

  add_index "gpxes", ["user_id"], :name => "index_gpxes_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "users_users", :force => true do |t|
    t.integer  "this_user_id"
    t.integer  "other_user_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "users_users", ["other_user_id"], :name => "index_users_users_on_other_user_id"
  add_index "users_users", ["this_user_id"], :name => "index_users_users_on_this_user_id"

  create_table "wpts", :force => true do |t|
    t.float    "lat"
    t.float    "lon"
    t.float    "ele"
    t.datetime "time"
    t.string   "name"
    t.integer  "gpx_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "wpts", ["gpx_id"], :name => "index_wpts_on_gpx_id"

end
