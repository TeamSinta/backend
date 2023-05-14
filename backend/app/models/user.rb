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

    # data = access_token
    puts "This is the access token: #{access_token}"
    # user = User.where(email: data['email']).first

    # user
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
      puts "Failed to get access_token."
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"
    end
  end
end
