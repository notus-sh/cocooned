# frozen_string_literal: true

lib = File.expand_path('lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'cocoon/version'

Gem::Specification.new do |spec|
  spec.name         = 'cocoon'
  spec.version      = Cocoon::VERSION
  spec.licenses     = ['Apache-2.0']
  spec.authors      = ['Gaël-Ian Havard', 'Nathan Van der Auwera']
  spec.email        = ['gael-ian@notus.sh', 'nathan@dixis.com']

  spec.summary      = 'Unobtrusive nested forms handling using jQuery.'
  spec.description  = 'Easier nested form. Supports standard Rails forms, Formtastic and SimpleForm.'
  spec.homepage     = 'http://github.com/notus-sh/cocoon'

  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = 'https://rubygems.org'
  else
    raise 'RubyGems 2.0 or newer is required.'
  end

  spec.require_paths = ['lib']
  spec.files         = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end

  spec.add_dependency 'rails', '>= 4.0', '<= 6.0'

  spec.add_development_dependency 'bundler', '~> 1.16'
  spec.add_development_dependency 'jasmine', '~> 3.2'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'rspec', '~> 3.8.0'
  spec.add_development_dependency 'rspec-rails', '~> 3.8.0'
  spec.add_development_dependency 'rubocop'
end
