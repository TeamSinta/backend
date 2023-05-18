class Api::V1::Users::UsersController < ApplicationController
  # before action and profile are only for testing authentication during development.
  before_action :authenticate_user!, only: [:profile]

  def profile
    render json: { user: current_user.as_json }
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :role, :email)
  end
end
