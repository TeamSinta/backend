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
    access_token = request.headers['Authorization'].split('Bearer ').last
    user_id = decode_jwt(access_token)
    puts "destroy method user_id: #{user_id}"

    user = User.find(user_id)

    if user
      user.destroy
      render json: { message: 'User was successfully deleted' }
    else
      raise ApiException::NotFound.new, 'User not found.'
    end
  rescue JWT::DecodeError
    raise ApiException::Unauthorized.new, 'Invalid or expired access token'
  end

  private

  def decode_jwt(token)
    puts "Decoding token....\n"
    decoded_token = JWT.decode(token, nil, false)[0]
    user_info_hash = JSON.parse(decoded_token['scp'])
    user_id = user_info_hash['user_id']
    puts "user_id: #{user_id}"
    user_id
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :role, :email)
  end
end
