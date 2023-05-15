class Api::V1::Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    puts "\nGoogle Oauth2 Controller Reached 👌Passing over to create a user..."
    code = params[:code]
    @user = User.from_omniauth(code)

    puts 'Found user info, now back at Controller.....'

    if @user.persisted?
      puts "#{@user.name} is logged in"

      access_token, = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil)

      render json: {
        accessToken: access_token,
        refreshToken: @user.refresh_tokens.last.token,
        user: @user
      }
    else
      puts 'user login failed'
    end
  end

  def refresh_jwt
    refresh_token = params[:refresh_token]

    tokens = OauthService.refresh_access_token(refresh_token)

    user = User.joins(:refresh_tokens).find_by(refresh_tokens: { token: refresh_token })

    if user
      # Destroy old token
      user.refresh_tokens.find_by(token: refresh_token).destroy

      # Create new Refresh Token
      new_refresh_token = SecureRandom.urlsafe_base64
      user.refresh_token.create!(token: new_refresh_token)

      # Create new access token
      jwt, = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      render json: { accessToken: jwt, refreshToken: new_refresh_token }
    else
      render json: { error: 'Invalid refresh token' }
    end
  end

  def logout
    refresh_token = params[:refresh_token]

    user = User.joins(:refresh_tokens).find_by(refresh_tokens: { token: refresh_token })

    if user
      # Invalidate(destroy) the refresh token
      user.refresh_tokens.find_by(token: refresh_token).destroy

      head :no_content
    else
      render json: { error: 'Invalid refresh token' }, status: :unauthorized
    end
  end

  def failure
    puts 'Omniauth Controller Failure'
  end
end
