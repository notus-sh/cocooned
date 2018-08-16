# frozen_string_literal: true

def capture_stdout
  original_stdout = $stdout
  $stdout = fake = StringIO.new
  begin
    yield
  ensure
    $stdout = original_stdout
  end
  fake.string
end

def capture_stderr
  original_stderr = $stderr
  $stderr = fake = StringIO.new
  begin
    yield
  ensure
    $stderr = original_stderr
  end
  fake.string
end
