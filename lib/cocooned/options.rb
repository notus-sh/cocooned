# frozen_string_literal: true

module Cocooned
  class Options
    attr_reader :bucket

    def initialize(bucket)
      @bucket = bucket.with_indifferent_access
    end

    def fetch(name, default = nil)
      candidates = candidates(name)
      extract(bucket, candidates) || (extract(bucket[:data], candidates) if bucket.key?(:data)) || default
    end

    def slice(*names)
      names.each_with_object({}) { |name, extracted| extracted[name] = fetch(name) }
    end

    protected

    def extract(hash, candidates)
      catch(:extracted) do
        candidates.each do |key|
          next unless hash.key?(key)
          throw :extracted, hash.delete(key)
        end

        nil
      end
    end

    def candidates(name)
      candidates = [name.to_s, "data_#{name}", "association_#{name}", "data_association_#{name}"]
      candidates + dasherize(*candidates)
    end

    def dasherize(*names)
      names.collect { |name| name.tr('_', '-') }
    end
  end
end
