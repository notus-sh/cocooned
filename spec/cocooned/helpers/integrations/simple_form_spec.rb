# frozen_string_literal: true

describe Cocooned::Helpers do
  before(:each) do
    @view = Class.new(ActionView::Base).new
    @person = Person.new
    @form = double(object: @person, object_name: @person.class.name)
  end

  describe '#cocooned_add_item_link' do
    subject do
      proc do |*args, &block|
        @view.cocooned_add_item_link(*args, &block)
      end
    end

    context 'with simple_form' do
      before(:each) do
        allow(@form).to receive_message_chain(:class, :ancestors) { ['SimpleForm::FormBuilder'] }
        expect(@form).to receive(:simple_fields_for).and_return('<form>')
        expect(@form).to receive(:fields_for).never
      end

      it_should_behave_like 'a link helper', :add, 3
    end
  end
end
