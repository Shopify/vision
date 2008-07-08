require 'servlet'

class ThemePickerServlet < Servlet      

  def choose    
    cookie = WEBrick::Cookie.new('theme', @params['theme'].to_s)
    cookie.path = '/'
    
    @response.cookies.push(cookie)
    
    redirect_to '/'
  end
  
  def index
    @themes = available_themes
  end
  
  def zip_theme
    theme = @params['theme']
    
    if @params['readme']
      File.open(THEMES + "/#{theme}/README", 'w+') do |fp|
        fp << @params['readme']
      end
    end
        
    location = "#{ROOT}/../exports/#{theme}.theme.zip"
    
    zip(theme, location) do |zip|
      
      content = zip.read
    
      @response['Content-Type'] = 'application/zip'
      @response['Content-disposition'] = "attachment; filename=#{theme}.theme.zip"
      @response['Content-Length'] = content.size

      render :text => content, :status => "200 Found"                    
    end
    
  end
  
  def create_theme
        
    unless @params['from'] and @params['to']
      @message = "Didn't get all required arguments: from '#{@params['from']}', to '#{@params['to']}'..."
      return
    end

    if @params['from'].empty? or @params['to'].empty?
      @message = "Didn't get all required arguments: from '#{@params['from']}', to '#{@params['to']}'..."
      return
    end
    
    from  = THEMES + "/#{@params['from']}"
    to    = THEMES + "/#{@params['to']}"    
    
    if not File.exist?(from)
      @message = 'Source theme does not exist...'
      return 
    end
    if File.exist?(to)
      @message = 'Target theme already exists...'
      return 
    end
    
    FileUtils.cp_r(from, to)

    Dir[to + '/**/.svn'].each do |svndir|
      FileUtils.rm_rf(svndir)
    end
    
    cookie = WEBrick::Cookie.new('theme', @params['to'])
    cookie.path = '/'
    
    @response.cookies.push(cookie)
        
    redirect_to '/'
  end
  
  def export  
    @themes = available_themes    
  end
  
  def export_theme
    @theme = @params['theme']
    @readme = File.read(THEMES + "/#{@theme}/README")
  end
  
  def update_readme
    @theme = @params['theme']    
    
    File.open(THEMES + "/#{@theme}/README", 'w+') do |fp|
      fp << @params['readme']
    end
    
    @readme = @params['readme']
    render :action => "export_theme"
  end
  
  def create
    @themes = available_themes    
  end
    
  private
  
  def available_themes
    Dir[THEMES + '/*'].collect do |theme|
      next unless File.directory?(theme)
      File.basename(theme)
    end.compact
  end
  
  def theme_cookie
    @request.cookies.find { |c| c.name == 'theme' }
  end
  
  def zip(theme, location)
    
    begin      
      FileUtils.mkdir_p(File.dirname(location))
      FileUtils.rm(location) if File.exists?(location)
      
      if RUBY_PLATFORM =~ /darwin/
        
        Dir.chdir(THEMES) do      
          system("zip -r \"#{location}\" #{theme}/ -x \"*.svn*\" -x \"*.git*\"")
        end
        
      else

        Zip::ZipFile.open(location, Zip::ZipFile::CREATE) do |zip|
          zip.mkdir(theme)
          zip.mkdir(theme + '/assets')
          zip.mkdir(theme + '/layout')
          zip.mkdir(theme + '/templates')
        
          base = THEMES + "/"
          files = []
          files += Dir["#{base}#{theme}/assets/*"]
          files += Dir["#{base}#{theme}/templates/*.liquid"]
          files += Dir["#{base}#{theme}/layout/theme.liquid"]
          files += Dir["#{base}#{theme}/README"]
        
          files.each do |file|
            position = file[base.size..-1]          
            zip.add(position, file)
          end
                
        end        
      end
                  
      File.open(location, "rb") { |fp| yield fp }
              
    rescue
      FileUtils.rm(location) if File.exists?(location)
      raise
    end
  end
  
end

