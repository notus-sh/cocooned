# frozen_string_literal: true

require 'nokogiri'

describe Cocoon::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
    @person = Person.new
    @form_obj = double(object: @person, object_name: @person.class.name)
  end

  context 'link_to_add_association' do
    context 'when using formtastic' do
      before(:each) do
        allow(@form_obj).to receive(:semantic_fields_for).and_return('form<tagzzz>')
      end

      context 'calls semantic_fields_for and not fields_for' do
        before do
          allow(@form_obj).to receive_message_chain(:class, :ancestors) { ['Formtastic::FormBuilder'] }
          expect(@form_obj).to receive(:semantic_fields_for)
          expect(@form_obj).to receive(:fields_for).never

          @html = @tester.link_to_add_association('add something', @form_obj, :children)
        end

        it_behaves_like 'a correctly rendered add link',
                        template: 'form<tagzzz>',
                        association: 'child',
                        associations: 'children'
      end
    end
  end
end
