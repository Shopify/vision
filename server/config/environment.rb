
ROOT =    File.expand_path(File.dirname(__FILE__) + '/../')
THEMES =  File.expand_path(ROOT + '/../themes')

$LOAD_PATH.unshift(ROOT + '/app/servlets')
$LOAD_PATH.unshift(ROOT + '/app/drops')
$LOAD_PATH.unshift(ROOT + '/app/tags')
$LOAD_PATH.unshift(ROOT + '/vendor/liquid/lib')
$LOAD_PATH.unshift(ROOT + '/vendor/rubyzip/lib')
$LOAD_PATH.unshift(ROOT + '/lib')


require 'webrick'
require 'yaml'
require 'class_attribute_accessor'
require 'module_attribute_accessors'
require 'logging'
require 'liquid'
require 'string_ext'
require 'fileutils'
require 'zip/zip'
require 'paginate'
require 'comment_form'
require 'active_support/json'

require File.dirname(__FILE__) + '/version'

Dir[ROOT + '/app/filters/*'].each do |file|
  filter = File.basename(file).split('.').first.to_classname
  require file
  Liquid::Template.register_filter Object.const_get(filter)
end


Liquid::Template.register_tag('paginate', Paginate)
Liquid::Template.register_tag('form', CommentForm)


# Require mount points. thats where the servlets of this server are setup
require File.dirname(__FILE__) + '/mounts'

