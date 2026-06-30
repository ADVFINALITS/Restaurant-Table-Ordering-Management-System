# Be sure to restart your server when you modify this file.
#
# Allows the Next.js frontend (a different origin/port) to call this
# API. Set FRONTEND_ORIGINS in your environment as a comma-separated
# list, e.g.:
#   FRONTEND_ORIGINS=http://localhost:3001,https://order.yourrestaurant.com
#
# Falls back to the standard local Next.js dev ports if unset, so
# `bin/rails server` plus `npm run dev` work together out of the box.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    default_origins = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
    origins ENV.fetch("FRONTEND_ORIGINS", default_origins).split(",").map(&:strip)

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
