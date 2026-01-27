# frozen_string_literal: true

# rubocop:disable RSpec/MultipleMemoizedHelpers
RSpec.describe Cocooned::Helpers::Tags do
  let(:template) { ActionView::Base.empty }
  let(:form) { ActionView::Helpers::FormBuilder.new('person', record, template, {}) }
  let(:association) { :contacts }
  let(:options) { { rel: :nofollow } }
  let(:record) { Person.new }

  shared_examples 'a tag helper' do |klass, as|
    before { allow(tag).to receive(:render) }

    let(:tag) { double }

    it 'uses correct rendering mode' do
      allow(klass).to expectations(receive(:new)).and_return(tag)
      method.call('label', *positional_arguments, options)

      expect(tag).to have_received(:render).with(as: as)
    end

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

  shared_examples 'a tag helper to add' do |as|
    it_behaves_like 'a tag helper', Cocooned::Tags::Add, as do
      def expectations(receiver)
        receiver.with(template, form, association, options)
      end

      def positional_arguments
        [form, association]
      end
    end
  end

  describe '#cocooned_add_item_link' do
    subject(:method) { template.method(:cocooned_add_item_link) }

    it_behaves_like 'a tag helper to add', :link
  end

  describe '#cocooned_add_item_button' do
    subject(:method) { template.method(:cocooned_add_item_button) }

    it_behaves_like 'a tag helper to add', :button
  end

  shared_examples 'a tag helper to remove' do |as|
    it_behaves_like 'a tag helper', Cocooned::Tags::Remove, as do
      def expectations(receiver)
        receiver.with(template, form, options)
      end

      def positional_arguments
        [form]
      end
    end
  end

  describe '#cocooned_remove_item_link' do
    subject(:method) { template.method(:cocooned_remove_item_link) }

    it_behaves_like 'a tag helper to remove', :link
  end

  describe '#cocooned_remove_item_button' do
    subject(:method) { template.method(:cocooned_remove_item_button) }

    it_behaves_like 'a tag helper to remove', :button
  end

  shared_examples 'a tag helper to move up' do |as|
    it_behaves_like 'a tag helper', Cocooned::Tags::Up, as do
      def expectations(receiver)
        receiver.with(template, options)
      end

      def positional_arguments
        []
      end
    end
  end

  describe '#cocooned_move_item_up_link' do
    subject(:method) { template.method(:cocooned_move_item_up_link) }

    it_behaves_like 'a tag helper to move up', :link
  end

  describe '#cocooned_move_item_up_button' do
    subject(:method) { template.method(:cocooned_move_item_up_button) }

    it_behaves_like 'a tag helper to move up', :button
  end

  shared_examples 'a tag helper to move down' do |as|
    it_behaves_like 'a tag helper', Cocooned::Tags::Down, as do
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

    it_behaves_like 'a tag helper to move down', :link
  end

  describe '#cocooned_move_item_down_button' do
    subject(:method) { template.method(:cocooned_move_item_down_button) }

    it_behaves_like 'a tag helper to move down', :button
  end

  context 'with deprecated methods', deprecation: '4.0' do
    describe '#link_to_add_association' do
      it 'is an alias to #cocooned_add_item_link' do
        allow(template).to receive(:cocooned_add_item_link)
        template.link_to_add_association('label', form, association)

        expect(template).to have_received(:cocooned_add_item_link).once
      end

      it 'warns about deprecation' do
        with_deprecation_as_exception(Cocooned::Deprecation['4.0']) do
          expect do
            template.link_to_add_association('label', form, association)
          end.to raise_error(ActiveSupport::DeprecationException)
        end
      end
    end

    describe '#link_to_remove_association' do
      it 'is an alias to #cocooned_remove_item_link' do
        allow(template).to receive(:cocooned_remove_item_link)
        template.link_to_remove_association('label', form)

        expect(template).to have_received(:cocooned_remove_item_link).once
      end

      it 'warns about deprecation' do
        with_deprecation_as_exception(Cocooned::Deprecation['4.0']) do
          expect do
            template.link_to_remove_association('label', form)
          end.to raise_error(ActiveSupport::DeprecationException)
        end
      end
    end
  end
end
# rubocop:enable RSpec/MultipleMemoizedHelpers
