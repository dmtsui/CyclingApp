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

ActiveRecord::Schema.define(:version => 20130426182119) do

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
    t.string   "version"
    t.string   "creator"
    t.datetime "time",       :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

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
