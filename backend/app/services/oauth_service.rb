# frozen_string_literal: true

# The OauthService is responsible for handling OAuth interactions
# with the Google Authorization service. This includes both authenticating
# authorization codes and refreshing access tokens. It makes HTTP requests
# to Google's servers and returns the response.
class OauthService
  def self.authenticate(auth_code)
    conn = Faraday.new
    response =
      conn.post(ENV['GOOGLE_AUTHORIZATION_URL']) do |req|
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
      case response.status
      when 401
        raise ApiException::Unauthorized, 'Bad Client ID or Client Secret'
      when 403
        raise ApiException::Forbidden, 'Invalid Authorization Code'
      else
        raise ApiException::ServiceError,
              "Unexpected response code: #{response.status}."
      end
    end
  end

  def self.refresh_access_token(refresh_token)
    conn = Faraday.new
    response =
      conn.post(ENV['GOOGLE_AUTHORIZATION_URL']) do |req|
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
      case response.status
      when 401
        raise ApiException::Unauthorized, 'Invalid or expired refresh token.'
      else
        raise ApiException::ServiceError,
              "Unexpected response code: #{response.status}."
      end
    end
  end
end
