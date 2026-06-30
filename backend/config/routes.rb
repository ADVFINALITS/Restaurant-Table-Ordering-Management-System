Rails.application.routes.draw do
  # Staff account auth (used by the admin menu screen only - the
  # diner / kitchen / waiter flow never logs in, see ApplicationController).
  post "/register", to: "auth#register"
  post "/login", to: "auth#login"

  namespace :api do
    get "menu", to: "menu#index"

    resources :orders, only: [:create, :show] do
      member do
        patch :status
        post :pay
      end
    end

    get "tables/:table_number/active_order", to: "tables#active_order"
    get "kitchen/orders", to: "kitchen#orders"
    get "waiter/orders", to: "waiter#orders"

    namespace :admin do
      resources :menu_items, only: [:index, :create, :update, :destroy]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
