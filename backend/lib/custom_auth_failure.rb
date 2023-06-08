# Overwritess Devise's default errors and formatting on 401/authorization errors
# to be consitent with the rest of the APIs
class CustomAuthFailure < Devise::FailureApp
  def respond
    self.status = 401
    self.content_type = 'json'
    self.response_body = {
      'error_code' => 40_101,
      'Message:' =>
        'Authentication Failed: Invalid or expired credentials. Please sign in again'
    }.to_json
  end
end
