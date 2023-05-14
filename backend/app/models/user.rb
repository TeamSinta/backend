class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :validatable,
         :omniauthable,
         :jwt_authenticatable,
         omniauth_providers: [:google_oauth2],
         jwt_revocation_strategy: none

  def self.from_omniauth(authorization_code)
    access_token = get_access_token(authorization_code)

    data = access_token.info
    user = User.where(email: data["email"]).first

    # Uncomment the section below if you want users to be created if they don't exist
    # unless user
    #     user = User.create(name: data['name'],
    #        email: data['email'],
    #        password: Devise.friendly_token[0,20]
    #     )
    # end
    user
  end

  def self.get_access_token(authorization_code)
    conn = Faraday.new
    response = conn.post(ENV['GOOGLE_AUTHORIZATION_URL'], {
      client_id: ENV['GOOGLE_CLIENT_ID'],
      client_secret: ENV['GOOGLE_CLIENT_SECRET'],
      code: authorization_code,
      grant_type: 'authorization_code',
      redirect_uri: ENV['REDIRECT_URI']
    })

    if response.status == 200
      puts "Successfully authorized code"
    else
      puts "unsuccessfull......"
    end
  end
end
