# Handles the callbacks from the Google OAuth2 authentication service.
class Api::V1::Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # Handles the callback from the Google OAuth2 authentication service
  def google_oauth2
    code = params[:code]
    @user = User.from_omniauth(code)

    raise ApiException::Unauthorized unless @user.persisted?
    access_token, = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil)

    render json: {
             accessToken: access_token,
             refreshToken: @user.refresh_tokens.last.token
           }
  end

  def failure
    raise ApiException::BadRequest.new, 'Unable to finialize user login action'
  end
end
