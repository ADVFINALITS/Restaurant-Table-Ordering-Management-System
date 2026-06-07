Rails.application.routes.draw do
  post "/register", to: "auth#register"
  post "/login", to: "auth#login"

  namespace :api do
    resources :orders
  end

  match "/api/auth/*path", to: "gateway#auth", via: :all
  match "/api/payments/*path", to: "gateway#payments", via: :all
  match "/api/kitchen/*path", to: "gateway#kitchen", via: :all
  match "/api/notifications/*path", to: "gateway#notifications", via: :all
end