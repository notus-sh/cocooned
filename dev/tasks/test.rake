# frozen_string_literal: true

namespace :test do
  namespace :integration do
    # rubocop:disable Rails/RakeEnvironment, Rake/Desc
    task :environment do
      require './spec/dummy/config/environment'
    end
    # rubocop:enable Rails/RakeEnvironment, Rake/Desc

    desc 'Rebuild integration tests templates'
    task prepare: :environment do
      templates = %i[link button].to_h do |use|
        response = ListsController.action(:new).call({ 'REQUEST_METHOD' => 'GET',
                                                       'QUERY_STRING' => "use=#{use}",
                                                       'rack.input' => '' })

        [use, Nokogiri::HTML(response.last.body).at('body > form')]
      end

      File.open('./npm/__tests__/fixtures/rails.json', 'w+') do |f|
        f.puts JSON.dump(templates)
      end
    end
  end
end
