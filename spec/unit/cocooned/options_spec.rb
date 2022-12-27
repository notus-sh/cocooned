# frozen_string_literal: true

describe Cocooned::Options do
  subject(:options) { described_class.new(hash) }

  VALUE = 'anything'

  describe '#slice' do
    {
      'direct'                        => { name: VALUE },
      'underscored data'              => { 'data_name': VALUE },
      'underscored association'       => { 'association_name': VALUE },
      'underscored data association'  => { 'data_association_name': VALUE },
      'dashed data'                   => { 'data-name': VALUE },
      'dashed association'            => { 'association-name': VALUE },
      'dashed data association'       => { 'data-association-name': VALUE },
      'data'                          => { data: { name: VALUE } },
      'data underscored association'  => { data: { association_name: VALUE } },
      'data dashed association'       => { data: { 'association-name': VALUE } }
    }.each do |context_name, sample|
      context "with #{context_name}" do
        let(:hash) { sample }

        it 'extracts expected value' do
          expect(options.slice(:name)).to include(name: VALUE)
        end

        it 'extracts only expected value' do
          expect(options.slice(:name).keys).to contain_exactly(:name)
        end
      end
    end
  end
end
