#!/usr/bin/env ruby
#--
# Copyright (c) 2005 Tobias Lutke
#
#++
PORT = 3232


# Load the environment
require File.dirname(__FILE__)  + '/server/config/environment.rb'

# change the current directory
Dir.chdir File.dirname(__FILE__)

# Setup webrick 
puts "=> Vision starting at http://localhost:#{PORT}/"

webrick = mount(WEBrick::HTTPServer.new(:Port => PORT ))

trap("INT") { $webrick.shutdown }


case RUBY_PLATFORM 
when /darwin/
  system("open http://localhost:#{PORT}/dashboard/")
when /win/
  system("start http://localhost:#{PORT}/dashboard/")
end

webrick.start
