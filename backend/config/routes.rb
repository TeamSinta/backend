Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'api/v1/users/sessions',
    registrations: 'api/v1/users/registrations',
    omniauth_callbacks: 'api/v1/users/omniauth_callbacks'
  }

  namespace :api do
    namespace :v1 do
      resources :users
    end
  end
end
