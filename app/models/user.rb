class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :gpxes_attributes, :gpx_ids, :username
  
  has_many :gpxes, inverse_of: :user
  
  has_and_belongs_to_many :followers, class_name: "User", foreign_key: "this_user_id", association_foreign_key: "other_user_id"
  
  accepts_nested_attributes_for :gpxes
  
end
