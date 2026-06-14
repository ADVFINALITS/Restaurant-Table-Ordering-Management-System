Rails.application.routes.draw do

  post "/register", to: "auth#register"
  post "/login", to: "auth#login"

  namespace :api do
    resources :orders
    resources :menu_items
  end

  # Gateway routes
  match "/api/auth/*path", to: "gateway#auth", via: :all
  match "/api/orders/*path", to: "gateway#orders", via: :all
  match "/api/payments/*path", to: "gateway#payments", via: :all
  match "/api/kitchen/*path", to: "gateway#kitchen", via: :all
  match "/api/notifications/*path", to: "gateway#notifications", via: :all
  match "/api/tables/*path", to: "gateway#tables", via: :all

  resources :tables do
    member do
      get :menu
      get :scan
    end
  end

  resources :orders
end