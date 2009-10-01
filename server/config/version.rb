require 'open-uri'
require 'rexml/document'

module Vision
  extend self
  
  attr_accessor :version
  attr_accessor :latest_version
  attr_accessor :update_url
  
  def uptodate?
    self.version >= self.latest_version
  end

  def verify_latest_version
    Thread.new do
      begin
        xml = REXML::Document.new(open("http://vision.shopify.com/version.xml?v=#{Vision.version}").read)
        self.latest_version  = xml.root.attributes['current']
        self.upgrade_url     = xml.root.attributes['href']
      rescue 
      end
    end
  end
end



<<<<<<< HEAD
Vision.version        = '3.4.0'  
=======
Vision.version        = '4.0.1'  
>>>>>>> 505ecf2b26424d0732067886bbaf5925f1f08a5e
Vision.latest_version = '0'
Vision.update_url     = 'http://vision.shopify.com/update.html'
Vision.verify_latest_version
