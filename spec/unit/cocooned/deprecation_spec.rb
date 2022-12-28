# frozen_string_literal: true

describe Cocooned::Deprecation do
  describe '.[]' do
    it 'returns a deprecator instance' do
      expect(described_class[]).to be_an_instance_of(described_class)
    end

    it 'returns a deprecator configured with the correct deprecation horizon' do
      expect(described_class['4.0'].deprecation_horizon).to eq('4.0')
    end

    it 'always returns the same deprecator instance for a version' do
      expect(described_class['4.0']).to be(described_class['4.0'])
    end
  end

  context 'with an instance' do
    subject(:deprecator) { described_class.new }

    it 'is a deprecator for Cocooned' do
      expect(deprecator.gem_name).to eq('Cocooned')
    end

    it 'has a default deprecation horizon a major release' do
      expect(deprecator.deprecation_horizon).to match(/\A\d+\.0\z/)
    end

    it 'has a default deprecation horizon to next major release' do
      current = Gem::Version.new(Cocooned::VERSION)
      target = Gem::Version.new(deprecator.deprecation_horizon)

      expect(target.segments.first).to eq(current.segments.first + 1)
    end
  end
end
