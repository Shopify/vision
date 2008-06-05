require 'logging'

class Servlet < WEBrick::HTTPServlet::AbstractServlet
  attr_reader :request, :response
  
  class NotFoundError < StandardError
  end

  class Redirection < RuntimeError
    def initialize(url)
      @location = url
    end
    
    attr_accessor :location
  end

  def handle(req, res)
    def req.method
      request_method.to_s.downcase.intern
    end
    @request = req
    @response = res    
    
    filename = ROOT + '/public/' + @request.path
    if File.exists?(filename) and not File.directory?(filename)
      @response['Content-Type'] = mime_types[File.extname(filename)[1..-1]]      
      @response.status = 200
      File.open(filename, "rb") do |fp|
        @response.body = fp.read
      end
      return
    end
      
    @response['Content-Type'] = "text/html"
    begin
      assembled_params
      
      @response.status = 200    
      invoke_action
    rescue Redirection => e
      @response.body = "<p>Redirecting to <a href=\"#{e.location}\">#{e.location}</a>"
      @response.status = 302
      @response['Location'] = e.location      
      logger.info "Redirecting to #{e.location}"
    rescue NotFoundError => e
      @response.body = "<p>File #{@request.path} could not be found.</a>"
      @response.status = 404
    rescue SyntaxError => e
      logger.error(e)
      @response.status = 500
      @response.body = rescue_error_in_public(e)
    end    
    rescue => e
      logger.error(e)
      @response.status = 500
      @response.body = rescue_error_in_public(e)
  end
  
  alias_method :do_PUT, :handle
  alias_method :do_GET, :handle
  alias_method :do_POST, :handle
  alias_method :do_DELETE, :handle
  
  def controller_name
    self.class.name.to_filename
  end
  
  def action_name
    @action_name ||= 'index'    
  end
  
  def self.layout(name)
    @layout = name
  end
  
  def self.layout_name
    @layout
  end
  
  protected
  
  def mime_types
    WEBrick::HTTPUtils::DefaultMimeTypes.update('js' => 'text/javascript')
  end
      
  def logger
    Logging.logger
  end
  
  def invoke_action
    logger.info "Calling #{@request.method.to_s.upcase}: '#{action_name}' -- #{@params.inspect}"
        
    if action_name.nil? or not respond_to?(action_name) or not public_methods.include?(action_name)
      raise NotFoundError, "No method responding to #{@request.path}" 
    end
    
    @pre_render_assigns = @rendered = nil
    @pre_render_assigns = instance_variables
    
    before_filter if self.respond_to?(:before_filter)
    @response.body = send(action_name)    
    @response.body = render if not @rendered    
    after_filter if self.respond_to?(:after_filter)
  end
  
  def render(options = {})
    raise StandardError, 'Double render error' if @rendered
    @rendered = true        
    return options[:text] if options[:text]    
    file_type = options[:type] || 'rhtml'
    file = options[:file] || "#{template_path}/#{options[:folder]}/#{options[:action] || action_name}.#{file_type}"
    logger.info " - rendering #{normalize_path(file)}"
    layout = options[:layout].nil? ? self.class.layout_name : options[:layout]
    if layout
      @content_for_layout = render_file(file, options)            

      layoutfile = "#{template_path}/#{layout}.#{file_type}"
      logger.info " - rendering layout #{normalize_path(layoutfile)}"
      render_file(layoutfile, options)
    else
      render_file(file, options)
    end
    
  end
  
  def redirect_to(url)
    raise Redirection.new(url)
  end
  
  def template_path
    "#{ROOT}/app/views/#{controller_name}"
  end
  
  def render_file(file, options={})
    tmpl = ERB.new(File.read(file))    
    tmpl.result(binding)
  end
  
  def rescue_error_in_public(e)
    @response.status = 404 if e.is_a?(NotFoundError)

    "<h1>#{e.class.name}</h1>\nMessage:<br/><blockquote><strong>#{e.message}</strong></blockquote>Parameters:<br/><blockquote>#{@params.inspect}</blockquote>Backtrace:<br/><blockquote><pre>#{e.backtrace.to_a.collect{|l| normalize_path(l) + "\n"}}</pre></blockquote>"
  end
  
  def path_scan
    @action_name = @request.path_info.scan(/^\/(\w+)/).flatten.last
  end
  
  def assigns
    assigns = assigned_variables
    logger.info " - exporting #{assigns.inspect}"
    assigns.inject({"request" => @request, "response" => @request, "controller" => self}) { |hash, name| hash[name[1..-1]] = instance_variable_get(name); hash }
  end
  
  def assigned_variables
    instance_variables - @pre_render_assigns
  end
  
  def normalize_path(path)
    filename = path.dup
    filename[ROOT] = '{ROOT}' if filename.include?(ROOT)
    filename
  end
  
  def assembled_params
    @params = {}

    # get params from url
    path_scan
    
    @params.update(@request.query)
            
    # get params from normal query parameters    
    @request.query_string.to_s.split('&').each do |string|
      s = string.split('=')
      @params[s[0]] = s[1]
    end
            
    @params
  end

end