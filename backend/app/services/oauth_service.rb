class OauthService
  def self.authenticate(auth_code)
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

  def self.refresh_access_token(refresh_token)
    conn = Faraday.new
    response = conn.post(ENV['GOOGLE_AUTHORIZATION_URL']) do |req|
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      req.body = {
        refresh_token: refresh_token,
        client_id: ENV['GOOGLE_CLIENT_ID'],
        client_secret: ENV['GOOGLE_CLIENT_SECRET'],
        grant_type: 'refresh_token'
      }.to_query
    end

    if response.status == 200
      JSON.parse(response.body)
    else
      puts 'Failed to refresh access_token'
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"
    end
  end
end
