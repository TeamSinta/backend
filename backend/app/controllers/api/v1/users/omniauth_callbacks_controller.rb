class Api::V1::Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    puts "Omniauth Controller saying HI"
  end

  def failure
    puts "Something went wrong....?"
  end
end
