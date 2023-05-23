class Api::V1::Users::SessionsController < ApplicationController
  def update_token
     refresh_token = request.headers['Authorization'].split('Bearer ').last
    # Finds user by token id and make's sure it didn't expire.
    user = User.joins(:refresh_tokens)
               .where(refresh_tokens: {
                        token: refresh_token,
                        expiration_date: Time.now..Float::INFINITY
                      }).first

    if user
      # Destroy old token
      user.refresh_tokens.find_by(token: refresh_token).destroy

      # Create new Refresh Token
      new_refresh_token = user.refresh_tokens.create!(token: SecureRandom.urlsafe_base64, expiration_date: Time.now + 1.month)

      # Create new access token
      jwt, = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      render json: { accessToken: jwt, refreshToken: new_refresh_token.token }
    else
      raise ApiException::Unauthorized.new, 'Invalid or expired refresh token.'
    end
  end

  def logout
    puts "n\ Logout Method Activated"

    refresh_token = request.headers['Authorization'].split('Bearer ').last

    puts "Refresh token: #{refresh_token}"

    user = User.joins(:refresh_tokens).find_by(refresh_tokens: { token: refresh_token })

    if user
      # Invalidate(destroy) the refresh token
      user.refresh_tokens.find_by(token: refresh_token).destroy
      render json: { user: 'User token deleted, so user is logged out' }, status: :ok

     # head :no_content
    else
      raise ApiException::Unauthorized.new("No user session found.")
    end
  end
end
