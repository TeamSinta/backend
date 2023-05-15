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
      # Gen new token
      jwt, = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      render json: { accessToken: jwt, refreshToken: refresh_token }
    else
      render json: { error: 'Invalid refresh token' }
    end
  end

  def failure
    puts 'Omniauth Controller Failure'
  end
end
