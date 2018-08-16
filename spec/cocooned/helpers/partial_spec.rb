# frozen_string_literal: true

require 'nokogiri'

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
  end

  describe '#get_partial_path' do
    it 'generates the default partial name if no partial given' do
      result = @tester.get_partial_path(nil, :contacts)
      expect(result).to eq('contact_fields')
    end

    it 'uses the given partial name' do
      result = @tester.get_partial_path('sub_fields', :contacts)
      expect(result).to eq('sub_fields')
    end
  end
end
