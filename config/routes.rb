Rails.application.routes.draw do
  post "/register", to: "auth#register"
  post "/login", to: "auth#login"

  namespace :api do
    resources :orders
  end

<<<<<<< HEAD
  match "/api/auth/*path", to: "gateway#auth", via: :all
  match "/api/payments/*path", to: "gateway#payments", via: :all
  match "/api/kitchen/*path", to: "gateway#kitchen", via: :all
  match "/api/notifications/*path", to: "gateway#notifications", via: :all
=======
  match "/api/tables/*path",
        to: "gateway#tables",
        via: :all

        resources :tables

>>>>>>> 8c24fb18b8e7ffbfd0b12e64bcce6000d6c652ae
end