# frozen_string_literal: true

# Ruby
require 'rubocop/rake_task'
RuboCop::RakeTask.new do |task|
  task.options = ['--config', 'dev/linters/ruby.yml']
end

# JavaScript
# rubocop:disable Rails/RakeEnvironment
# eslint related tasks does not need to load Rails environment
eslint_args = ['--no-eslintrc', '--config dev/linters/js.json']
eslint_path = ['npm/src', 'npm/__tests__/']

namespace :eslint do
  desc 'Auto-correct eslint offenses'
  task :auto_correct do
    system("yarnpkg run eslint #{(eslint_args + ['--fix']).join(' ')} #{eslint_path.join(' ')}")
  end
end

desc 'Run eslint'
task :eslint do
  system("yarnpkg run eslint #{eslint_args.join(' ')} #{eslint_path.join(' ')}")
end
# rubocop:enable Rails/RakeEnvironment

# Both
namespace :linters do
  desc 'Auto-correct Rubocop and eslint offenses'
  task auto_correct: ['rubocop:auto_correct', 'eslint:auto_correct']
end

desc 'Run Rubocop and eslint'
task linters: %i[rubocop eslint]
