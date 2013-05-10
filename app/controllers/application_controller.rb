class ApplicationController < ActionController::Base
  protect_from_forgery :except => :receive_guess
  
  helper_method :current_or_guest_user

  # if user is logged in, return current_user, else return guest_user
  def current_or_guest_user
    if current_user
      if session[:guest_user_id]
        # logging_in
        guest_user.destroy
        session[:guest_user_id] = nil
      end
      current_user
    else
      guest_user
    end
  end

  # find guest_user object associated with the current session,
  # creating one as needed
  def guest_user
    # Cache the value the first time it's gotten.
    #@cached_guest_user ||= User.find(session[:guest_user_id] ||= create_guest_user.id)
    @cached_guest_user ||= User.find(2);

  rescue ActiveRecord::RecordNotFound # if session[:guest_user_id] invalid
     session[:guest_user_id] = nil
     guest_user
  end
  
  private
  
  def create_guest_user
    u = User.create(:email => "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save!(:validate => false)
    session[:guest_user_id] = u.id
    u
  end
  
  
  
end
