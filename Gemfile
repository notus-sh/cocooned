# frozen_string_literal: true

source 'http://rubygems.org'

# Specify your gem's dependencies in rack-address_munging.gemspec
gemspec

group :development, :test do
  gem 'json_pure'
  gem 'rails', '~> 4.2'
  gem 'simplecov', require: false
  gem 'sqlite3'

  gem 'generator_spec'
  gem 'nokogiri'

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
