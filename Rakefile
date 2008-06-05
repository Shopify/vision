require 'rake/gempackagetask'
require 'rake/contrib/rubyforgepublisher'
require 'fileutils'  
require 'server/config/version'


NAME = 'vision'
FILE_ZIP = "#{NAME}-#{Vision.version}.zip"
FILE_TGZ = "#{NAME}-#{Vision.version}.tgz"

spec = Gem::Specification.new do |s|
  s.name = NAME
  s.version = Vision.version
  s.has_rdoc = false
  s.files  = Dir.glob('**/*', File::FNM_DOTMATCH).reject do |f| 
     [ /\.$/, /^public/, /^exports/, /^misc/, /Rakefile$/, /\.log$/, /^pkg/, /\.git/, /\.svn/, /\~$/, /\/\._/, /\.DS/].any? {|regex| f =~ regex }
  end
  s.require_path = '.'
  s.summary = 'Shopify Design Server'
  s.author = "Tobias Luetke"
  s.email = "tobi@jadedpixel.com"
end

Rake::GemPackageTask.new(spec) do |p|
  p.gem_spec = spec
  p.need_tar = false
  p.need_zip = true
end


desc "Publish web page and all that jazz to shopify.com"
task :publish => [:create_page, :copy_files] do  
  system("rsync --delete --progress -arz pkg/html/ vision.shopify.com:/u/apps/vision/current/public/")
end

desc "Release web page and all that jazz to shopify.com"
task :release => [:publish]
task :deploy => [:publish]

desc "Create page"
task :create_page do  
  require 'erb'
  puts "Releasing version #{Vision.version}"
  html = File.dirname(__FILE__) + '/pkg/html'  
  public = File.dirname(__FILE__) + '/public'
  
  FileUtils.mkdir_p(html)
  FileUtils.mkdir_p(html + '/stylesheets')
  FileUtils.mkdir_p(html + '/images/corners')
  FileUtils.mkdir_p(html + '/media')
  FileUtils.mkdir_p(html + '/misc')

  @version = Vision.version
  @file_zip = FILE_ZIP
  #@file_tgz = FILE_TGZ
  
  file_list = Dir.glob('public/**/*')
  
  file_list.reject! do |f| 
     [ /\.$/, /\.svn/, /\.DS/].any? {|regex| f =~ regex }
  end
    
  file_list.each do |f|
    next if File.directory?(f)
    
    f['public/'] = ''
  
    if ['.xml', '.html'].include?(File.extname(f))
      tmpl = ERB.new(File.read("#{public}/#{f}"))    
      File.open( "#{html}/#{f}", 'w+') do |fp| 
        fp << tmpl.result(binding)
      end      
    else
      
      FileUtils.cp("#{public}/#{f}", "#{html}/#{f}")
      
    end
    
    
  end
  
  
end

task :copy_files => [:package] do 
  html = 'pkg/html/files'  
  FileUtils.mkdir_p(html)

  FileUtils.cp("pkg/#{FILE_ZIP}", "pkg/html/files")
  #FileUtils.cp("pkg/#{FILE_TGZ}", "pkg/html/files")  
end