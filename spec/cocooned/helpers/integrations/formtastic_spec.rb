# frozen_string_literal: true

require 'nokogiri'

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form_obj = double(object: @person, object_name: @person.class.name)
  end

  context 'cocooned_add_item_link' do
    context 'when using formtastic' do
      before(:each) do
        allow(@form_obj).to receive(:semantic_fields_for).and_return('form<tagzzz>')
      end

      context 'calls semantic_fields_for and not fields_for' do
        before do
          allow(@form_obj).to receive_message_chain(:class, :ancestors) { ['Formtastic::FormBuilder'] }
          expect(@form_obj).to receive(:semantic_fields_for)
          expect(@form_obj).to receive(:fields_for).never

          @html = @tester.cocooned_add_item_link('add something', @form_obj, :contacts)
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'form<tagzzz>',
                        association: 'contact',
                        associations: 'contacts'
      end
    end
  end
end
