class Api::V1::Users::UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :created_at
end
