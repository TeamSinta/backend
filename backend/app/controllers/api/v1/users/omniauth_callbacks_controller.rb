class Api::V1::Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    puts "\nGoogle Oauth2 Controller Reached 👌Passing over to create a user..."
    code = params[:code]
    @user = User.from_omniauth(code)

    if @user.persisted?
        puts "User is logged in"
       # sign_in_and_redirect @user, event: :authentication
      else
        puts "user login failed"
       # session['devise.google_data'] = request.env['omniauth.auth'].except('extra') # Removing extra as it can overflow some session stores
        #redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
      end
  end

  def failure
    puts "Omniauth Controller Failure"
  end
end
