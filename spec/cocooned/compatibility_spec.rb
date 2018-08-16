# frozen_string_literal: true

# Cocoon compatibility
# TODO: Remove in 2.0

describe Cocooned::Railtie do
  subject { Class.new(ActionView::Base).new }

  it { is_expected.to respond_to(:link_to_add_association) }
  it { is_expected.to respond_to(:link_to_remove_association) }
end

describe Cocooned::Helpers do
  describe '#cocooned_default_label' do
    before(:each) do
      @tester = Class.new(ActionView::Base).new
    end

    after(:each) do
      I18n.reload!
    end

    context 'using the :cocoon i18n scope' do
      before(:each) do
        allow(self).to receive(:warn)
        I18n.backend.store_translations(:en, cocoon: {
                                          defaults: { remove: 'Remove' },
                                          posts: { remove: 'Remove this post' }
                                        })
      end

      it 'should use custom translations when available' do
        capture_stderr do
          expect(@tester.send(:cocooned_default_label, :posts, :remove)).to eq('Remove this post')
        end
      end

      it 'should use default translations when not' do
        capture_stderr do
          expect(@tester.send(:cocooned_default_label, :people, :remove)).to eq('Remove')
        end
      end

      it 'should emit a warning' do
        expect(capture_stderr { @tester.send(:cocooned_default_label, :people, :remove) }).not_to be_empty
      end
    end
  end
end
