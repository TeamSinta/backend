# frozen_string_literal: true

# The OauthService is responsible for handling OAuth interactions
# with the Google Authorization service. This includes both authenticating
# authorization codes and refreshing access tokens. It makes HTTP requests
# to Google's servers and returns the response.
class OauthService
  def self.authenticate(auth_code)
    response =
      send_request(
        code: auth_code,
        client_id: ENV.fetch('GOOGLE_CLIENT_ID', nil),
        client_secret: ENV.fetch('GOOGLE_CLIENT_SECRET', nil),
        redirect_uri: ENV.fetch('REDIRECT_URI', nil),
        grant_type: 'authorization_code'
      )
    handle_response(
      response,
      401 => 'Bad Client ID or  Client Secret',
      403 => 'Invalid Authorization Code'
    )
  end

  def self.refresh_access_token(refresh_token)
    response =
      send_request(
        refresh_token:,
        client_id: ENV.fetch('GOOGLE_CLIENT_ID', nil),
        client_secret: ENV.fetch('GOOGLE_CLIENT_SECRET', nil),
        grant_type: 'refresh_token'
      )
    handle_response(response, 401 => 'Invalid or expired refresh token')
  end

  def self.send_request(params)
    conn = Faraday.new
    conn.post(ENV.fetch('GOOGLE_AUTHORIZATION_URL', nil)) do |req|
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      req.body = params.to_query
    end
  end

  def self.handle_response(response, error_map)
    if response.status == 200
      JSON.parse(response.body)
    else
      error_message =
        error_map[response.status] ||
          "Unexpected response code: #{response.status}."
      raise ApiException::ServiceError, error_message
    end
  end
end
