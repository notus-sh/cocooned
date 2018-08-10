# frozen_string_literal: true

source 'http://rubygems.org'

# Specify your gem's dependencies in rack-address_munging.gemspec
gemspec

group :development, :test do
  gem 'rails', '~> 4.2'
  gem 'sqlite3'
  gem 'nokogiri'
  gem 'simplecov', require: false

  platforms :rbx do
    gem 'psych', '~> 2.2'
    gem 'racc'
    gem 'rubinius-coverage', '< 2.1'
    gem 'rubinius-developer_tools'
    gem 'rubysl'
    gem 'rubysl-coverage', '< 2.1'
    gem 'rubysl-test-unit'
  end
end
