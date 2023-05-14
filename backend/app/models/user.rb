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
    puts "Authorization Code #{authorization_code}"
    access_token = get_access_token(authorization_code)

    data = access_token
    puts "This is the access token: #{access_token}"

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

  def self.get_access_token(auth_code)
    conn = Faraday.new(url:'https://oauth2.googleapis.com') do | faraday |
      faraday.request :url_encoded
      faraday.adapter Faraday.default_adapter
    end

    response = conn.post('/token') do |req|
      req.params['client_id'] = ENV['GOOGLE_CLIENT_ID']
      req.params['client_secret'] = ENV['GOOGLE_CLIENT_SECRET']
      req.params['code'] = auth_code
      req.params['grant_type'] = 'authorization_code'
      req.params['prompt'] = 'none'
      req.params['access_type'] = 'offline'
      req.params['redirect_uri'] = URI.encode_www_form_component(ENV['REDIRECT_URI'])
    end

    if response.status == 200
      puts "Successfully authorized code and got access_token"
    else
      puts "Failed to get access_token. See information below."
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"
    end
    response
  end
end
