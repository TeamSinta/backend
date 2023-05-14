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
    puts "Authorization Code: #{authorization_code}"
    access_token = get_access_token(authorization_code)

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

  def self.get_access_token(auth_code)
    conn = Faraday.new
    response = conn.post(ENV['GOOGLE_AUTHORIZATION_URL']) do |req|
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      req.body = {
        code: auth_code,
        client_id: ENV['GOOGLE_CLIENT_ID'],
        client_secret: ENV['GOOGLE_CLIENT_SECRET'],
        redirect_uri: ENV['REDIRECT_URI'],
        grant_type: 'authorization_code'
      }.to_query
    end

    if response.status == 200
      JSON.parse(response.body)
    else
      puts 'Failed to get access_token.'
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"
    end
  end
end
