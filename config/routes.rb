CyclingApp::Application.routes.draw do
  root to: "gpxes#index"
  resources :gpxes, except:[:new, :edit] do 
    resources :bounds, only:[:create,:destroy]
    resources :wpts, except: [:new, :edit]
  end
end
