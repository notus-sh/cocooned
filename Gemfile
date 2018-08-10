source "http://rubygems.org"

# Specify your gem's dependencies in rack-address_munging.gemspec
gemspec

group :development, :test do
  gem "rails", "~> 4.2"
  gem "sqlite3"
  gem "json_pure"
  gem "simplecov", :require => false

  gem 'nokogiri'
  gem "generator_spec"

  platforms :rbx do
    gem 'rubysl'
    gem 'rubysl-test-unit'
    gem 'psych', '~> 2.2'
    gem 'racc'
    gem 'rubinius-developer_tools'
    gem 'rubinius-coverage', '< 2.1'
    gem 'rubysl-coverage', '< 2.1'
  end
end
