# frozen_string_literal: true

namespace :test do
  namespace :integration do
    task :environment do
      require './spec/dummy/config/environment'
    end

    desc 'Rebuild integration tests templates'
    task prepare: :environment do
      response = ListsController.action(:new).call({ 'REQUEST_METHOD' => 'GET', 'rack.input' => '' })
      template = Nokogiri::HTML(response.last.body).at('body > form')

      File.open('./npm/__tests__/fixtures/list.json', 'w+') do |f|
        f.puts JSON.dump({ template: template })
      end
    end
  end
end
