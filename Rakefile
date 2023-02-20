# frozen_string_literal: true

require 'rubocop/rake_task'
RuboCop::RakeTask.new do |task|
  task.options = ['--config', 'dev/rubocop.yml']
end

Dir['./dev/tasks/**/*.rake'].each { |f| load f }
