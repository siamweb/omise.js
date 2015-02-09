require "bundler/setup"

task :compile do
  require "uglifier"

  File.open("dist/omise.js", "w") do |file|
    file.puts File.read("vendor/easyXDM.js")
    file.puts File.read("src/omise.js")
  end

  File.open("dist/omise.min.js", "w") do |file|
    file.puts Uglifier.compile(File.read("dist/omise.js"), :output => {
      :comments => :none
    })
  end
end
