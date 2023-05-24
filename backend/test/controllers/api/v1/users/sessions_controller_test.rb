require "test_helper"

class Api::V1::Users::SessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get update_token" do
    get api_v1_users_sessions_update_token_url
    assert_response :success
  end

  test "should get logout" do
    get api_v1_users_sessions_logout_url
    assert_response :success
  end
end
