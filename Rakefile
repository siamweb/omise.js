require "bundler/setup"

task :compile do
  require "uglifier"
  File.open("omise.min.js", "w") do |file|
    minified = Uglifier.compile(File.read("omise.js"))
    file.puts minified
  end
end
