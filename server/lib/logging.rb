require 'logger'

module Logging
  mattr_accessor :log_file
  mattr_accessor :log_level
  
  #@@log_file  = ROOT + '/log/production.log'
  @@log_file  = STDOUT
  @@log_level = Logger::Severity::WARN
  
  def self.logger
    @logger ||= create_logger
  end
  
  private
  
  def self.create_logger
    logger = Logger.new(log_file)
    logger.level = log_level
    logger
  end
end