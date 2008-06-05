require 'servlet'

class VisionServlet < Servlet      
  
  def vision_js
    @response["Content-Type"] = 'text/javascript'    
    
    render :action => 'vision', :type => 'js'
  end
  
  def vision_css
    @response["Content-Type"] = 'text/css'    
    
    render :action => 'vision', :type => 'css'
  end
  
  def vision_html_js
    @current_theme = theme_cookie.value || 'None selected'
    @current_template = template_cookie ? template_cookie.value : @params['action']
    
    @themes = themes_for_view
    @templates = templates_for_view   
    
    rhtml = render(:action => 'vision', :type => 'rhtml')
    "var vision_html = '#{escape_javascript(rhtml)}';"
  end
  



  def templates_for_view

    available_templates = [["Cookie.destroy('#{@params['action']}'); window.location.reload();", "#{@params['action']}.liquid"]]
    
    Dir["#{theme_template_path}/#{@params['action']}.*.liquid"].each do |f|
      variant = File.basename(f, File.extname(f))
      available_templates << ["Cookie.set('#{@params['action']}', '#{variant}'); window.location.reload();", "#{variant}.liquid"]
    end
    
    available_templates << ['', '-------------']      
    available_templates += standard_templates.collect do |loc, name|
      ["window.location='#{loc}';", name]
    end
    available_templates
  end
  
  def themes_for_view
    Dir[THEMES + '/*'].collect do |theme|
      next unless File.directory?(theme)
      File.basename(theme)
    end.compact
  end
  
  def standard_templates
    [  ['/', 'Frontpage'], 
       ['/collections/snowboards', 'Collection Page'], 
       ['/collections/snowboards/season2006+beginner', 'Collection Page (with tags)'], 
       ['/collections/paginated-sale', 'Collection Page (Paginated, Page Nr.5)'], 
       ['/products/arbor-draft', 'Product Page'], 
       ['/cart', 'Shopping Cart'], 
       ['/pages/about', 'Solo Page'],
       ['/blogs/bigcheese-blog', 'Blog Page'],
       ['/blogs/paginated-blog', 'Blog Page (Paginated, Page Nr.1)']
       ]
  end

  def listify_docs(docs)
    result = ["<ul>"]
    docs.sort.each do |key, val|
      result << "<li>"
      val = key == 'syntax' ? "<pre><code> #{val} </code></pre>" : val
      key = key == 'description' ? '' : key
      result <<  "<span>#{key}</span> #{val.kind_of?(Hash) ? listify_docs(val) : val}"
      result << "</li>"
    end
    
    result << "</ul>"
  end
  
  def load_docs_database
    YAML.load(File.read("#{ROOT}/db/docs.yml"))
  end
  
  def options_for_javascript(options)
    '{' + options.map {|k, v| "#{k}:#{v.kind_of?(Hash) ? options_for_javascript(v) : "'#{v}'"}"}.sort.join(', ') + '}'
  end
  
  def render_as_js_string(name, html)
    result = []
    html.gsub!(/\'/, 'wadasdas!!!!')
    
    result << %|var #{name} = ''+|
    result << html.to_a.collect do |line|
      %|\t\'#{line.chomp}\'+\n|
    end
    result << %|\t'';|
    result.to_s
  end
  
  def escape_javascript(javascript)
    (javascript || '').gsub(/\r\n|\n|\r/, "\\n").gsub(/["']/) { |m| "\\#{m}" }
  end
  
  def path_scan
    if @request.path_info =~ /(\w+)\.(js|css)/
      @action_name = "#{$1}_#{$2}"
    else
      raise NotFoundError
    end
  end

  
  private
  
  def theme_cookie
    @request.cookies.find { |c| c.name == 'theme' }
  end


  def template_cookie
    @request.cookies.find { |c| c.name == "template_#{@params['action']}" }
  end
  
  def theme_template_path
    "#{THEMES}/#{theme_cookie.value}/templates"
  end
  
end

