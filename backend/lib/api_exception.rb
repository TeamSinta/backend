# ApiException module defines a set of custom exception classes and a handler module for exception handling.
# The handler module is included in other classes to add exception handling functionality.
# This is then included in application_controller so that this can be used throughout the application.

module ApiException
  # Handler module is included in other classes to add exception handling functionality.
  module Handler
    def self.included(klass)
      klass.class_eval do
        ApiException::BaseError.descendants.each do |error_class|
          rescue_from error_class do |err|
            render status: err.status_code, json: {error_code: err.error_code, message: err.message}
          end
        end
      end
    end
  end

  class BaseError < StandardError
    attr_reader :status_code, :error_code
  end

  class BadRequest < BaseError
    def initialize(msg = "The request could not be understood or was missing required parameters.")
      @status_code = 400
      @error_code = 40001
      super
    end
  end

  class Unauthorized < BaseError
    def initialize(msg = "Authentication credentials were missing or incorrect.")
      @status_code = 401
      @error_code = 40101
      super
    end
  end

  class Forbidden < BaseError
    def initialize(msg = "The request was understood, but it has been refused or access is not allowed.")
      @status_code = 403
      @error_code = 40301
      super
    end
  end

  class NotFound < BaseError
    def initialize(msg = "The URI requested is invalid or the resource requested does not exist.")
      @status_code = 404
      @error_code = 40401
      super
    end
  end

  class ServiceError < BaseError
    def initialize(msg = nil)
      @status_code = 500
      @error_code = 50001
      super
    end
  end
end
