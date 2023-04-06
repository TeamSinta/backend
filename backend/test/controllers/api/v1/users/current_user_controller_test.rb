require "test_helper"

class Api::V1::Users::CurrentUserControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_users_current_user_index_url
    assert_response :success
  end
end
