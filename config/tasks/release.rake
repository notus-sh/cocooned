# frozen_string_literal: true

require 'bundler/gem_tasks'
require 'json'

spec = Bundler.load_gemspec('./cocooned.gemspec')
npm_scope = 'notus.sh'

npm_src_dir = './npm'
npm_dest_dir = './dist'
CLOBBER.include 'dist'

assets_dir = './app/assets/'

npm_files = {
  File.join(npm_dest_dir, 'cocooned.js') => File.join(assets_dir, 'javascripts', 'cocooned.js'),
  File.join(npm_dest_dir, 'cocooned.css') => File.join(assets_dir, 'stylesheets', 'cocooned.css'),
  File.join(npm_dest_dir, 'README.md') => File.join(npm_src_dir, 'README.md'),
  File.join(npm_dest_dir, 'LICENSE') => './LICENSE'
}

namespace :npm do
  # rubocop:disable Rails/RakeEnvironment
  # npm related tasks does not need to load Rails environment
  npm_files.each do |dest, src|
    file dest => src do
      cp src, dest
    end
  end

  task :'package-json' do
    contributors = []
    spec.authors.each_with_index do |name, i|
      next if spec.email[i].nil?

      contributors << {
        name: name.dup.force_encoding('UTF-8'),
        email: spec.email[i].dup.force_encoding('UTF-8')
      }
    end

    template = ERB.new(File.read(File.join(npm_src_dir, 'package.json.erb')))
    content = template.result_with_hash(scope: npm_scope, spec: spec, contributors: contributors)
    File.write(File.join(npm_dest_dir, 'package.json'),
               JSON.pretty_generate(JSON.parse(content)))
  end

  desc "Build #{npm_scope}-#{spec.name}-#{spec.version}.tgz into the pkg directory"
  task build: (%i[package-json] + npm_files.keys) do
    system("cd #{npm_dest_dir} && npm pack && mv ./#{npm_scope}-#{spec.name}-#{spec.version}.tgz ../pkg/")
  end

  desc "Build and push #{npm_scope}-#{spec.name}-#{spec.version}.tgz to https://npmjs.org"
  task release: %i[build] do
    system("npm publish ./pkg/#{npm_scope}-#{spec.name}-#{spec.version}.tgz --access public")
  end
  # rubocop:enable Rails/RakeEnvironment
end

desc 'Build packages and push them to their respective repository'
task releases: [:release, 'npm:release']
