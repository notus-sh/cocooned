# frozen_string_literal: true

RSpec.shared_examples 'an action tag builder', :tag do |action|
  it 'supports explicit label' do
    expect(tag('label').text).to eq('label')
  end

  it 'supports label as a block' do
    expect(tag { 'label' }.text).to eq('label')
  end

  it 'supports default label' do
    expect(tag.text).to eq(action.to_s.titleize)
  end

  context 'with translations available in the :cocooned namespace' do
    before { I18n.backend.store_translations(I18n.locale, cocooned: { defaults: { action => 'Translated' } }) }
    after { I18n.reload! }

    it 'uses available translations for default label' do
      expect(tag.text).to eq('Translated')
    end

    it 'does not warn about deprecation', deprecation: '3.0' do
      with_deprecation_as_exception(Cocooned::Deprecation['3.0']) do
        expect { tag.text }.not_to raise_error
      end
    end
  end

  context 'with translations available in the :cocooned namespace', deprecation: '3.0' do
    before { I18n.backend.store_translations(I18n.locale, cocoon: { defaults: { action => 'Translated' } }) }
    after { I18n.reload! }

    it 'uses available translations' do
      expect(tag.text).to eq('Translated')
    end

    it 'warns about deprecation' do
      with_deprecation_as_exception(Cocooned::Deprecation['3.0']) do
        expect { tag.text }.to raise_error(ActiveSupport::DeprecationException)
      end
    end
  end

  context 'with a :class option' do
    it 'supports CSS classes as an array' do
      expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two')
    end

    it 'supports CSS classes as a string' do
      expect(tag(class: 'one two').attribute('class').value.split).to include('one', 'two')
    end
  end

  context 'with data-attributes' do
    it 'supports Rails data: options' do
      expect(tag(data: { attr: 'any' }).attribute('data-attr')).not_to be_nil
    end

    context 'when using older data-* options',  deprecation: '3.0' do
      it 'supports them as data-attributes' do
        expect(tag('data-attr': 'any').attribute('data-attr')).not_to be_nil
      end

      it 'warns about deprecation' do
        with_deprecation_as_exception(Cocooned::Deprecation['3.0']) do
          expect { tag('data-attr': 'any') }.to raise_error(ActiveSupport::DeprecationException)
        end
      end
    end
  end
end
