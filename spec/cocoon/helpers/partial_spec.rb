# frozen_string_literal: true

require 'nokogiri'

describe Cocoon::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
  end

  describe '#get_partial_path' do
    it 'generates the default partial name if no partial given' do
      result = @tester.get_partial_path(nil, :admin_comments)
      expect(result).to eq('admin_comment_fields')
    end

    it 'uses the given partial name' do
      result = @tester.get_partial_path('comment_fields', :admin_comments)
      expect(result).to eq('comment_fields')
    end
  end
end
