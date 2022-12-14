# frozen_string_literal: true

Rails.application.routes.draw do
  resources :lists
  root to: 'lists#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
