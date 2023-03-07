# frozen_string_literal: true

RSpec.describe Cocooned::Helpers::Containers, :action_view do
  let(:template) { ActionView::Base.empty }

  shared_examples 'a container helper' do |class_name, attribute_name|
    it 'has a default class' do
      html = method.call { 'any' }
      expect(container(html).attribute('class').value.split).to include(class_name)
    end

    it 'has a default data attribute' do
      html = method.call { 'any' }
      expect(container(html).attributes.keys).to include(attribute_name)
    end

    it 'supports additional classes' do
      html = method.call(class: 'more') { 'any' }
      expect(container(html).attribute('class').value.split).to include(class_name, 'more')
    end

    it 'supports additional data attributes' do
      html = method.call(data: { attribute: 'value' }) { 'any' }
      expect(container(html).attributes.keys).to include(attribute_name, 'data-attribute')
    end
  end

  describe '#cocooned_container' do
    subject(:method) { template.method(:cocooned_container) }

    let(:options) { { limit: 12, reorderable: { startAt: 0 } } }

    it_behaves_like 'a container helper', 'cocooned-container', 'data-cocooned-container'

    it 'has a data attribute for cocooned options' do
      html = method.call { 'any' }
      expect(container(html).attributes.keys).to include('data-cocooned-options')
    end

    it 'extracts cocooned options' do
      html = method.call(options) { 'any' }
      expect(container(html).attributes.keys).not_to include(options.keys)
    end

    it 'forwards cocooned options' do
      html = method.call(options) { 'any' }
      expect(container(html).attribute('data-cocooned-options').value).to eq(options.to_json)
    end
  end

  describe '#cocooned_item' do
    subject(:method) { template.method(:cocooned_item) }

    it_behaves_like 'a container helper', 'cocooned-item', 'data-cocooned-item'

    it 'has a legacy class', deprecation: '3.0' do
      html = method.call { 'any' }
      expect(container(html).attribute('class').value.split).to include('nested-fields')
    end
  end
end
