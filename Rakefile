require "bundler/setup"

task :compile do
  require "uglifier"
  File.open("dist/omise.min.js", "w") do |file|
    minified = Uglifier.compile(File.read("src/omise.js"))
    file.puts minified
  end
end
