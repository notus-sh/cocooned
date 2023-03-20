# frozen_string_literal: true

require 'bundler/gem_tasks'
require 'erb'
require 'json'

class NpmTasks < Rake::TaskLib # :nodoc:
  SCOPE = 'notus.sh'

  attr_reader :dest, :gemspec, :src

  def initialize(gemspec, src, dest)
    super()
    @gemspec = Bundler.load_gemspec(gemspec)
    @src = File.absolute_path(src)
    @dest = File.absolute_path(dest)

    setup_tasks
  end

  protected

  # rubocop:disable Rails/RakeEnvironment, Metrics/AbcSize, Metrics/MethodLength
  def setup_tasks
    namespace(:npm) do
      desc 'Build package.json from template'
      task :'package.json' do
        template = ERB.new(File.read(File.join(src, 'package.json.erb')))
        generated = template.result_with_hash(scope: SCOPE, gemspec: gemspec, contributors: contributors)
        File.write(File.join(src, 'package.json'), JSON.pretty_generate(JSON.parse(generated)))
      end

      desc 'Ensure the destination directory exist'
      task :dest do
        FileUtils.mkdir_p(dest)
      end

      desc 'Build package tarball into the pkg directory'
      task build: %i[package.json dest] do
        system("cd #{src} && npm pack --pack-destination #{dest}/")
      end

      desc 'Build and push package to npmjs.com'
      task release: %i[build] do
        system("npm publish #{tarball} --access public")
      end
    end
  end
  # rubocop:enable Rails/RakeEnvironment, Metrics/AbcSize, Metrics/MethodLength

  def tarball
    Dir["#{dest}/#{SCOPE}-#{gemspec.name}-#{gemspec.version}.tgz"].first
  end

  def contributors
    @contributors ||= begin
      authors = Array.new(gemspec.authors.size) { |i| [gemspec.email[i], gemspec.authors[i]] }
      authors.collect do |(email, name)|
        { name: name.dup.force_encoding('UTF-8'), email: email.dup.force_encoding('UTF-8') }
      end
    end
  end
end

NpmTasks.new('./cocooned.gemspec', './npm', './pkg')

desc 'Build packages and push them to their respective repository'
task releases: [:release, 'npm:release']
