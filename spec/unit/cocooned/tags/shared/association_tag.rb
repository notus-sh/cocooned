# frozen_string_literal: true

RSpec.shared_examples 'an action tag builder with an association', :tag do |action, association|
  context 'with translations available in the :cocooned namespace' do
    before { I18n.backend.store_translations(I18n.locale, cocooned: { association => { action => 'Translated' } }) }
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
    before { I18n.backend.store_translations(I18n.locale, cocoon: { association => { action => 'Translated' } }) }
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
end
