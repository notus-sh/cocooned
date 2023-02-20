# frozen_string_literal: true

lib = File.expand_path('lib', __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'cocooned/version'

Gem::Specification.new do |spec|
  spec.name         = 'cocooned'
  spec.version      = Cocooned::VERSION
  spec.licenses     = ['Apache-2.0']
  spec.authors      = ['Gaël-Ian Havard', 'Nathan Van der Auwera']
  spec.email        = ['gael-ian@notus.sh', 'nathan@dixis.com']

  spec.summary      = 'Unobtrusive Rails nested forms handling, with or without jQuery.'
  spec.description  = 'Easier nested form. Supports standard Rails forms, Formtastic and SimpleForm.'
  spec.homepage     = 'https://github.com/notus-sh/cocooned'

  raise 'RubyGems 2.0 or newer is required.' unless spec.respond_to?(:metadata)
  spec.metadata = {
    'allowed_push_host' => 'https://rubygems.org',

    'bug_tracker_uri'   => 'https://github.com/notus-sh/cocooned/issues',
    'changelog_uri'     => 'https://github.com/notus-sh/cocooned/blob/master/CHANGELOG.md',
    'homepage_uri'      => 'https://github.com/notus-sh/cocooned',
    'source_code_uri'   => 'https://github.com/notus-sh/cocooned',
    'funding_uri'       => 'https://opencollective.com/notus-sh'
  }

  spec.require_paths = ['lib']

  excluded_dirs = %r{^(.github|dev|npm|spec)/}
  excluded_files = %w[.gitignore .rspec Gemfile Gemfile.lock Rakefile package.json yarn.lock]
  spec.files = `git ls-files -z`.split("\x0").reject do |f|
    f.match(excluded_dirs) || excluded_files.include?(f)
  end
  spec.required_ruby_version = '>= 2.6'

  spec.add_dependency 'rails', '>= 5.0', '<= 7.1'

  spec.add_development_dependency 'bundler', '~> 2.1'
  spec.add_development_dependency 'formtastic', '~> 4.0'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'rspec', '~> 3.11'
  spec.add_development_dependency 'rspec-rails', '>= 5.0'
  spec.add_development_dependency 'rubocop'
  spec.add_development_dependency 'rubocop-performance'
  spec.add_development_dependency 'rubocop-rails'
  spec.add_development_dependency 'rubocop-rake'
  spec.add_development_dependency 'rubocop-rspec'
  spec.add_development_dependency 'simple_form', '~> 5.1'
end
