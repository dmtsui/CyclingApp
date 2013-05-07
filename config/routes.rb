CyclingApp::Application.routes.draw do
  root to: "gpxes#index"
  resources :gpxes, except:[:new, :edit]
  match 'gpxes/:id' => 'gpxes#patch', :via => :patch

  
  devise_for :users
  
  
  
end
