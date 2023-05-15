# frozen_string_literal: true
class Api::V1::Users::SessionsController < Devise::SessionsController
  def logout
    # Revokes the jti on the user and effectively makes them unable to  "authenticate"
    current_user.revoke.jwt

    head :no_content
  end
end


# THIS IS CURRENTLY UNUSED. NOT SURE IF NEEDED.
