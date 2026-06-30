class JsonWebToken
  SECRET_KEY = begin
    Rails.application.credentials.jwt_secret
  rescue StandardError
    # Rails.application.credentials raises (not just returns nil) when
    # config/master.key is missing - which it will be on a fresh
    # clone, since it's gitignored by design. Fall through to ENV /
    # the dev default instead of crashing every request.
    nil
  end || ENV["JWT_SECRET"] || "dev_secret_key"

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
