class Api::V1::Users::UsersController < ApplicationController
  # skip_before_action :verify_authenticity_token

  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def index
    @users = User.all
    render json: @users
  end

  # def create
  #   @user = User.new(user_params)
  #   if @user.save
  #    render json: @user
  #   else
  #     render :new, status: :unprocessable_entity
  #   end
  # end



  def destroy
    @user = User.find(params[:id])
    @user.destroy
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :role, :email)
  end

end
