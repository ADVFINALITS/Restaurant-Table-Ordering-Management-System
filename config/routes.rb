Rails.application.routes.draw do

  match "/api/auth/*path",
        to: "gateway#auth",
        via: :all

  match "/api/orders/*path",
        to: "gateway#orders",
        via: :all

  match "/api/payments/*path",
        to: "gateway#payments",
        via: :all

  match "/api/kitchen/*path",
        to: "gateway#kitchen",
        via: :all

  match "/api/notifications/*path",
        to: "gateway#notifications",
        via: :all

  match "/api/tables/*path",
        to: "gateway#tables",
        via: :all

        resources :tables
        resources :orders

end