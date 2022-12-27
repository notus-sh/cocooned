# frozen_string_literal: true

describe Cocooned::Options do
  subject(:options) { described_class.new(hash) }

  DUMMY = 'anything'

  describe '#slice' do
    {
      direct:                         { name: DUMMY },
      underscored_data:               { 'data_name': DUMMY },
      underscored_association:        { 'association_name': DUMMY },
      underscored_data_association:   { 'data_association_name': DUMMY },
      dashed_data:                    { 'data-name': DUMMY },
      dashed_association:             { 'association-name': DUMMY },
      dashed_data_association:        { 'data-association-name': DUMMY },
      data:                           { data: { name: DUMMY } },
      data_underscored_association:   { data: { association_name: DUMMY } },
      data_dashed_association:        { data: { 'association-name': DUMMY } }
    }.each do |context_name, sample|
      context "with #{context_name}" do
        let(:hash) { sample }

        it 'extracts expected value' do
          expect(options.slice(:name)).to include(name: DUMMY)
        end

        it 'extracts only expected value' do
          expect(options.slice(:name).keys).to contain_exactly(:name)
        end
      end
    end
  end
end
