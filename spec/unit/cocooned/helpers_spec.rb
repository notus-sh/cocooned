# frozen_string_literal: true

require 'unit/shared/link_helper'

describe Cocooned::Helpers do
  let(:template) { ActionView::Base.empty }
  let(:form) { ActionView::Base.default_form_builder.new('person', record, template, {}) }
  let(:association) { :contacts }
  let(:options) { { rel: :nofollow } }
  let(:record) { Person.new }

  shared_examples 'a tag helper' do |klass|
    before { allow(tag).to receive(:render) }

    let(:tag) { double }

    it 'supports explicit label' do
      allow(klass).to expectations(receive(:new)).and_return(tag)
      method.call('label', *positional_arguments, options)

      expect(klass).to expectations(have_received(:new))
    end

    it 'supports label as a block' do
      allow(klass).to expectations(receive(:new)).and_return(tag)
      method.call(*positional_arguments, options) { 'label' }

      expect(klass).to expectations(have_received(:new))
    end

    it 'supports default label' do
      allow(klass).to expectations(receive(:new)).and_return(tag)
      method.call(*positional_arguments, options)

      expect(klass).to expectations(have_received(:new))
    end

    it 'supports keyword options' do
      allow(klass).to expectations(receive(:new)).and_return(tag)
      method.call(*positional_arguments, **options)

      expect(klass).to expectations(have_received(:new))
    end
  end

  describe '#cocooned_add_item_link' do
    subject(:method) { template.method(:cocooned_add_item_link) }

    it_behaves_like 'a tag helper', Cocooned::Tags::Add do
      def expectations(receiver)
        receiver.with(template, form, association, options)
      end

      def positional_arguments
        [form, association]
      end
    end
  end

  describe '#cocooned_remove_item_link' do
    subject(:method) { template.method(:cocooned_remove_item_link) }

    it_behaves_like 'a tag helper', Cocooned::Tags::Remove do
      def expectations(receiver)
        receiver.with(template, form, options)
      end

      def positional_arguments
        [form]
      end
    end
  end

  describe '#cocooned_move_item_up_link' do
    subject(:method) { template.method(:cocooned_move_item_up_link) }

    it_behaves_like 'a tag helper', Cocooned::Tags::Up do
      def expectations(receiver)
        receiver.with(template, options)
      end

      def positional_arguments
        []
      end
    end
  end

  describe '#cocooned_move_item_down_link' do
    subject(:method) { template.method(:cocooned_move_item_down_link) }

    it_behaves_like 'a tag helper', Cocooned::Tags::Down do
      def expectations(receiver)
        receiver.with(template, options)
      end

      def positional_arguments
        []
      end
    end
  end
end
