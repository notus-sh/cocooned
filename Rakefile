# frozen_string_literal: true

require 'bundler/gem_tasks'

# Test suites
require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new

task default: :spec

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

# Linters
require 'rubocop/rake_task'
RuboCop::RakeTask.new do |task|
  task.options = ['--config', 'config/linters/ruby.yml']
end

eslint_args = ['--no-eslintrc', '--config config/linters/js.json']
eslint_path = ['app/assets/**/*.js', 'spec/javascripts/**/*.js', 'spec/dummy/app/assets/**/*.js']

namespace :eslint do
  desc 'Auto-correct JavaScript files'
  task :auto_correct do
    system("yarnpkg run eslint #{(eslint_args + ['--fix']).join(' ')} #{eslint_path.join(' ')}")
  end
end

desc 'Lint JavaScript code'
task :eslint do
  system("yarnpkg run eslint #{eslint_args.join(' ')} #{eslint_path.join(' ')}")
end

# Documentation
require 'rdoc/task'

Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'Cocoon'
  rdoc.options << '--line-numbers' << '--inline-source'
  rdoc.rdoc_files.include('README.rdoc')
  rdoc.rdoc_files.include('lib/**/*.rb')
end
