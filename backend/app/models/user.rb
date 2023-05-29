# User model representing user accounts in the application.
# Includes Devise modules for authentication and JWT token management.
# Provides a class method for authenticating users with an authorization code.
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  has_many :refresh_tokens, dependent: :destroy
  devise :database_authenticatable,
         :registerable,
         :validatable,
         :omniauthable,
         :jwt_authenticatable,
         omniauth_providers: [:google_oauth2],
         jwt_revocation_strategy: self

  def self.from_omniauth(authorization_code)
    authentication_response = OauthService.authenticate(authorization_code)

    unless authentication_response
      raise ApiException::BadRequest.new,
            'Unable to authenticate user and get data'
    end
    user_info = JWT.decode(authentication_response['id_token'], nil, false)[0]
    create_or_update_user(user_info)
  end

  def self.create_or_update_user(user_info)
    User
      .find_or_create_by!(email: user_info['email']) do |user|
        assign_user_attributes(user, user_info)
      end
      .tap { |user| create_refresh_token(user) }
  end

  def self.assign_user_attributes(user, user_info)
    user.assign_attributes(
      first_name: user_info['given_name'],
      last_name: user_info['family_name'],
      email: user_info['email'],
      photo: user_info['picture'],
      password: Devise.friendly_token[0, 20],
      provider: 'google',
      role: 1
    )
  end

  def self.create_refresh_token(user)
    user.refresh_tokens.create(
      token: SecureRandom.urlsafe_base64,
      expiration_date: Time.now + 1.month
    )
  end
end
