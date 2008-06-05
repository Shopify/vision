require 'servlet'

class StaticAssetsServlet < Servlet      

  def serve_file    
    filepath = "#{template_path}/#{@params['file']}"
    if File.exists?(filepath)
      @response['Content-Type'] = mime_types[File.extname(filepath)[1..-1]]         
      File.open(filepath, "rb") do |fp|
   	render :text => fp.read
      end      
    else
      raise NotFoundError
    end
  end  
  
  protected
  
  def template_path
    "#{THEMES}/#{@theme}/assets"
  end
  
  def before_filter
    cookie = @request.cookies.find { |c| c.name == 'theme' }
    
    if cookie.nil?
      redirect_to '/dashboard/'
    end
    
    @theme = cookie.value
  end

  
  def path_scan
    @params['file'] = @request.path_info    
    @action_name = 'serve_file'      
  end
  
  private
  
  def extra(str)
    str
  end
  
  
end

