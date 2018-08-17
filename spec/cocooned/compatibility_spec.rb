# frozen_string_literal: true

# Cocoon compatibility
# TODO: Remove in 2.0

describe Cocooned::Railtie do
  subject { Class.new(ActionView::Base).new }

  it { is_expected.to respond_to(:link_to_add_association) }
  it { is_expected.to respond_to(:link_to_remove_association) }
end

describe Cocooned::Helpers do
  before(:each) do
    @tester = Class.new(ActionView::Base).new
  end

  describe '#cocooned_default_label' do
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
          expect(@tester.send(:cocooned_default_label, :remove, :posts)).to eq('Remove this post')
        end
      end

      it 'should use default translations when not' do
        capture_stderr do
          expect(@tester.send(:cocooned_default_label, :remove, :people)).to eq('Remove')
        end
      end

      it 'should emit a warning' do
        expect(capture_stderr { @tester.send(:cocooned_default_label, :remove, :people) }).not_to be_empty
      end
    end
  end

  describe '#cocooned_add_item_link' do
    before(:each) do
      @person = Person.new
      @form   = double(object: @person, object_name: @person.class.name)
      allow(@tester).to receive(:cocooned_render_association).and_return('form<tag>')
    end

    context 'with a limit' do
      before(:each) do
        @stderr_output = capture_stderr do
          @html = @tester.cocooned_add_item_link('add something', @form, :posts, limit: 3)
        end
      end

      it_behaves_like 'a correctly rendered add link', extra_attributes: { 'data-limit' => '3' }

      it 'should emit a warning' do
        expect(@stderr_output).not_to be_empty
      end
    end
  end
end
