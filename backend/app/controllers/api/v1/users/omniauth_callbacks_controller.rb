class Api::V1::Users::OmniAuthCallbacksController < Devise::OmniAuthCallbacksController
  def google_oauth2
    puts "Omniauth Controller saying HI"
  end


  def failure
    puts "Something went wrong....?"
  end

end
