class Api::V1::Users::UsersController < ApplicationController
  # skip_before_action :verify_authenticity_token


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
