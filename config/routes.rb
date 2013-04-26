CyclingApp::Application.routes.draw do
  root to: "gpxes#index"
  resources :gpxes
end
