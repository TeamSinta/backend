# API controller for managing user profiles, information retrieval, and account deletion.
# Requires user authentication for profile and destroy actions.
class Api::V1::Users::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:profile, :destroy]

  def profile
    render json: { user: current_user.as_json }
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def destroy
    if current_user
      current_user.destroy
      render json: { message: 'User and user data was successfully deleted' }
    else
      raise ApiException::NotFound.new, 'User not found.'
    end
  rescue JWT::DecodeError
    raise ApiException::Unauthorized.new, 'Invalid or expired access token'
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :role, :email)
  end
end
