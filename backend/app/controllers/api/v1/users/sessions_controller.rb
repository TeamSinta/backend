# Controller for handling session-related actions such as token updates and logout.
class Api::V1::Users::SessionsController < ApplicationController
  def update_token
    refresh_token = request.headers['Authorization'].split('Bearer ').last
    user =
      User
        .joins(:refresh_tokens)
        .where(
          refresh_tokens: {
            token: refresh_token,
            expiration_date: Time.now..Float::INFINITY
          }
        )
        .first

    if user
      user.refresh_tokens.find_by(token: refresh_token).destroy
      new_refresh_token =
        user.refresh_tokens.create!(
          token: SecureRandom.urlsafe_base64,
          expiration_date: Time.now + 1.month
        )
      jwt, = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      render json: { accessToken: jwt, refreshToken: new_refresh_token.token }
    else
      raise ApiException::Unauthorized.new, 'Invalid or expired refresh token.'
    end
  end

  def logout
    refresh_token = request.headers['Authorization'].split('Bearer ').last

    user =
      User.joins(:refresh_tokens).find_by(
        refresh_tokens: {
          token: refresh_token
        }
      )

    if user
      user.refresh_tokens.find_by(token: refresh_token).destroy
      render json: {
               user: 'User token deleted, so user is logged out'
             },
             status: :ok
    else
      raise ApiException::Unauthorized.new('No user session found.')
    end
  end
end
