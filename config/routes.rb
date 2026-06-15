Rails.application.routes.draw do
  post "/register", to: "auth#register"
  post "/login", to: "auth#login"

  namespace :api do
    resources :orders
    resources :menu_items
  end

  # Gateway routes
  match "/api/auth/*path", to: "gateway#auth", via: :all
  match "/api/payments/*path", to: "gateway#payments", via: :all
  match "/api/kitchen/*path", to: "gateway#kitchen", via: :all
  match "/api/notifications/*path", to: "gateway#notifications", via: :all
  match "/api/tables/*path", to: "gateway#tables", via: :all

  # Tables
  resources :tables do
    member do
      get :menu
      get :scan
    end
  end

  # Orders
  resources :orders

  # Carts
  resources :carts do
    member do
      post :add_item
      patch :update_item
      delete :remove_item
    end
  end
end