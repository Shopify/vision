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

trap("INT") { $webrick.shutdown }
trap("TERM") { $webrick.shutdown }

puts 'starting...'

begin 
  mount(WEBrick::HTTPServer.new(:Port => PORT ))

  case RUBY_PLATFORM 
  when /darwin/
    system("open http://localhost:#{PORT}/dashboard/")
  when /win/
    system("start http://localhost:#{PORT}/dashboard/")
  end

  $webrick.start
rescue => e
  
  if RUBY_PLATFORM && !$tried_to_kill
    $tried_to_kill ||= 3
    $tried_to_kill -= 1
    
    if $tried_to_kill > 0
      puts "Trying to stop existing vision process..."
      pid = `ps x | grep vision.rb`.to_a[0].split[0]
      Process.kill(:SIGTERM, pid.to_i)
      sleep(1)
    end
    retry
  end
  
  puts "Could not start vision, port #{PORT} already used."
end
