# frozen_string_literal: true

require_relative './shared/association_tag'
require_relative './shared/tag'

describe Cocooned::Tags::Remove, :tag do
  let(:template) { ActionView::Base.empty }
  let(:record) { Person.new }
  let(:form) { ActionView::Helpers::FormBuilder.new('person[contacts_attributes][0]', record, template, {}) }

  it_behaves_like 'an action tag builder', :remove
  it_behaves_like 'an action tag builder with an association', :remove, :contacts

  it 'has a default class' do
    expect(tag.attribute('class').value.split).to include('cocooned-remove')
  end

  it 'has a compatibility class with the original Cocoon', deprecation: '3.0' do
    expect(tag.attribute('class').value.split).to include('remove_fields')
  end

  it 'has a .dynamic class for new records' do
    allow(record).to receive(:new_record?).and_return(true)
    expect(tag.attribute('class').value.split).to include('dynamic')
  end

  it 'does not have a .dynamic class for persisted records' do
    allow(record).to receive(:new_record?).and_return(false)
    expect(tag.attribute('class').value.split).not_to include('dynamic')
  end

  it 'does not have an .existing class for new records' do
    allow(record).to receive(:new_record?).and_return(true)
    expect(tag.attribute('class').value.split).not_to include('existing')
  end

  it 'has an .existing class for persisted records' do
    allow(record).to receive(:new_record?).and_return(false)
    expect(tag.attribute('class').value.split).to include('existing')
  end

  it 'does not have a .destroyed class for alive record' do
    allow(record).to receive(:marked_for_destruction?).and_return(false)
    expect(tag.attribute('class').value.split).not_to include('destroyed')
  end

  it 'has a .destroyed class for record marked for destruction' do
    allow(record).to receive(:marked_for_destruction?).and_return(true)
    expect(tag.attribute('class').value.split).to include('destroyed')
  end

  it 'supports more classes' do
    expect(tag(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-remove')
  end

  it 'has a data attribute to identify it as a trigger' do
    expect(tag.attribute('data-cocooned-trigger').value).to eq('remove')
  end

  it 'outputs an input field' do
    expect(html.at('input')).not_to be_nil
  end

  it 'outputs a hidden field' do
    expect(html.at('input').attribute('type').value).to eq('hidden')
  end

  it 'outputs a _destroy field' do
    expect(html.at('input').attribute('name').value).to end_with('[_destroy]')
  end

  it 'outputs a field namespaced by association' do
    expect(html.at('input').attribute('name').value).to start_with('person[contacts_attributes][0]')
  end

  it 'sets correct _destroy value for alive record' do
    allow(record).to receive(:marked_for_destruction?).and_return(false)
    expect(html.at('input').attribute('value').value).to eq('false')
  end

  it 'sets correct _destroy value for record marked for destruction' do
    allow(record).to receive(:marked_for_destruction?).and_return(true)
    expect(html.at('input').attribute('value').value).to eq('true')
  end
end
