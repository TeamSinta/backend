class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :validatable,
         :omniauthable, :jwt_authenticatable,
         omniauth_providers: [:google_oauth2],
         jwt_revocation_strategy: JwtDenylist
end
