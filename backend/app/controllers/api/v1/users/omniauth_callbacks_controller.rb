class Api::V1::Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    puts "\nGoogle Oauth2 Controller Reached 👌Passing over to create a user..."
    code = params[:code]
    @user = User.from_omniauth(code)
    # puts "User Object: #{@user.inspect}"

    puts "Found user info, now back at Controller....."

    if @user.persisted?
     puts 'User is logged in'
   else
     puts 'user login failed'
   end
  end

  def failure
    puts 'Omniauth Controller Failure'
  end
end
