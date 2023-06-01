# Handles the users sessions with updating tokens and logging out..
class Api::V1::Users::SessionsController < ApplicationController
  def update_token
    refresh_token = extract_refresh_token
    user = find_user_by_refresh_token(refresh_token)

    unless user
      raise ApiException::Unauthorized.new, 'Invalid or expired refresh token.'
    end

    destroy_refresh_token(user, refresh_token)
    new_refresh_token = create_new_refresh_token(user)
    jwt, = generate_jwt(user)
    render json: { accessToken: jwt, refreshToken: new_refresh_token.token }
  rescue ApiException::Unauthorized => e
    render_exception(e)
  end

  def logout
    refresh_token = extract_refresh_token
    user = find_user_by_refresh_token(refresh_token)

    raise ApiException::Unauthorized, 'No user session found.' unless user
    destroy_refresh_token(user, refresh_token)
      .first
  end

  def destroy_refresh_token(user, refresh_token)
    user.refresh_tokens.find_by(token: refresh_token)&.destroy
  end

  def create_new_refresh_token(user)
    user.refresh_tokens.create!(
      token: SecureRandom.urlsafe_base64,
      expiration_date: Time.now + 1.month
    )
  end

  def generate_jwt(user)
    Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
  end

  def render_exception(exception)
    render status: exception.status_code,
           json: {
             error_code: exception.error_code,
             message: exception.message
           }
  end
end
