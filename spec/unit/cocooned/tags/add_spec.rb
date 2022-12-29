# frozen_string_literal: true

require_relative './shared/association_tag'
require_relative './shared/tag'

describe Cocooned::Tags::Add, :tag do
  let(:template) { ActionView::Base.empty }
  let(:association) { :contacts }
  let(:record) { Person.new }
  let(:form) { ActionView::Base.default_form_builder.new('person', record, template, {}) }

  it_behaves_like 'an action tag builder', :add
  it_behaves_like 'an action tag builder with an association', :add, :contacts

  it 'have a default class' do
    expect(link.attribute('class').value.split).to include('cocooned-add')
  end

  it 'supports more classes' do
    expect(link(class: %i[one two]).attribute('class').value.split).to include('one', 'two', 'cocooned-add')
  end
end
