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
    puts "Authorization Code: #{authorization_code}"
    authentication_response = OauthService.authenticate(authorization_code)

    # Decode User Information from Access Token ID and create/find user
    if authentication_response
      user_info = JWT.decode(authentication_response['id_token'], nil, false)[0]
      user = User.find_or_create_by!(email: user_info['email']) do |user|
        user.name = user_info['name']
        user.email = user_info['email']
        user.password = Devise.friendly_token[0, 20]
        user.password = 'password'
      end

      user.refresh_tokens.create(token: access_token['refresh_token'])
      user
    else
      puts "There's no access token to handle."
    end
  end

end
