class JsonWebToken
  SECRET_KEY = Rails.application.credentials.jwt_secret || ENV["JWT_SECRET"] || "dev_secret_key"

  def self.encode(payload)
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: "HS256" })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError, JWT::VerificationError
    nil
  end
end