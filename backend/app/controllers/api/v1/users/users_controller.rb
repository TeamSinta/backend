# API controller for managing user profiles, information retrieval, and account deletion.
# Requires user authentication for profile and destroy actions.
class Api::V1::Users::UsersController < ApplicationController
  before_action :authenticate_user!, only: %i[profile destroy]

  def profile
    # raise not showing because it fails before. Probably in authenticate user.
    render json: { user: current_user.as_json }
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def destroy
    raise ApiException::NotFound.new, 'User not found.' unless current_user
    current_user.destroy
    render json: { message: 'User and user data was successfully deleted' }
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :role, :email)
  end
end
