class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :validatable,
         :omniauthable,
         :jwt_authenticatable,
         omniauth_providers: [:google_oauth2],
         jwt_revocation_strategy: self

  def self.from_omniauth(authorization_code)
    puts "Authorization Code: #{authorization_code}"
    access_token = OauthService.get_access_token(authorization_code)

    # Handle the Access Token
    if access_token
      id_info = JWT.decode(access_token['id_token'], nil, false)[0]
      puts "\nThis is the user info from id_token: #{id_info}"
      puts "\nUser Name: #{id_info['email']}"
      puts "User Email: #{id_info['name']}"
      puts "Picture URL: #{id_info['picture']}"
    else
      puts "There's no access token to handle."
    end
  end

end
