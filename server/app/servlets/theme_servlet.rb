require 'liquid_servlet'
require 'database'
require 'cart_drop'
require 'shop_drop'
require 'page_collection_drop'
require 'blog_collection_drop'
require 'collection_collection_drop'
require 'link_list_collection_drop'
require 'search_drop'

class ThemeServlet < LiquidServlet      
  layout '../layout/theme'

  def index
    @page_title = 'Welcome'
    render :type => :liquid
  end
  
  def product
    @product = Database.find(:all, :products).find { |p| p['handle'] == @params['handle']}
    @page_title = @product['title']
    
    render :type => :liquid, :action => template_considering_cookies
  end  

  def collection    
    
    
    @current_tags     = @params['tags'].to_s.split
    @products         = Proc.new { |c| c['collection.products']}
    @products_count   = Proc.new { |c| c['collection.products_count']}
    @tags             = Proc.new { |c| c['collection.tags']}
    
    @collection = Database.find(:all, :collections).find { |p| p['handle'] == @params['handle']}
    @collection['tags'] = @collection['products'].collect { |p| p['tags'] }.flatten.uniq
    @collection['products'].reject! { |p| @current_tags.any?{ |tag| p['tags'].include?(tag) } }
    @collection['products_count'] ||= @collection['products'].size

    @page_title = @collection['title']
    
    render :type => :liquid, :action => template_considering_cookies
  end  
  
  def cart    
    if @params['checkout'] or @params['checkout.x'] or @params['checkout.y']
      redirect_to '/checkout'
      return 
    end
    
    @page_title = 'Your Cart'

    render :type => :liquid, :action => template_considering_cookies
  end

  def page
    @page = Database.find(:all, :pages).find { |a| a['handle'] == @params['handle']}
    @page_title = @page['title']
    
    render :type => :liquid, :action => template_considering_cookies
  end
    
  def blog
    @blog = Database.find(:all, :blogs).find { |a| a['handle'] == @params['handle']}
    @page_title = @blog['title']
    
    render :type => :liquid, :action => template_considering_cookies
  end
  
  def article
    @blog = Database.find(:all, :blogs).find { |a| a['handle'] == @params['handle']}
    @article = @blog["articles"].detect { |a| a["id"].to_i == @params["article"].to_i}
    @page_title = @article["title"]
    render :type => :liquid, :action => template_considering_cookies
  end
  
  def checkout
    render :file => "#{ROOT}/app/views/#{controller_name}/checkout.html", :layout => false
  end

  def search
    if File.exist?("#{template_path}/search.liquid")      
      render :type => :liquid, :action => template_considering_cookies
    else
      render :file => "#{ROOT}/app/views/#{controller_name}/search.html", :layout => false
    end
  end
  
  def not_found
    if File.exist?("#{template_path}/404.liquid")
      render :type => :liquid, :action => "404"
    else
      render :file => "#{ROOT}/app/views/#{controller_name}/404.html", :layout => false
    end
  end
  
  protected
  
  def before_filter
    cookie = @request.cookies.find { |c| c.name == 'theme' }
    
    if cookie.nil?
      redirect_to '/dashboard/'
    end
    
    # export drops
    @theme    = cookie.value        
    @cart     = CartDrop.new
    @shop     = ShopDrop.new    

    @collections= CollectionCollectionDrop.new    
    @linklists  = LinkListCollectionDrop.new
    @pages      = PageCollectionDrop.new   
    @blogs      = BlogCollectionDrop.new
    @search     = SearchResultDrop.new
    
    @template     = @action_name
    @handle       = @params['handle'] if @params['handle']
    @current_page = @params['handle'] == 'paginated-sale' ? 5 : 1 
    
    @content_for_header = <<-HEADERS
    <!-- We inject some stuff here which you won't find on the live server. -->
    <!-- if you need prototype yourself you need to manually include it in your layout --> 
    <link rel="stylesheet" href="/stylesheets/vision/vision.css" type="text/css" media="screen" charset="utf-8" />
    <script type="text/javascript" src="/javascripts/vision/vision_html.js?action=#{@action_name}"></script>
    <script type="text/javascript" src="/javascripts/vision/vision.js?action=#{@action_name}"></script>
    <script>
      window.onload = function() { initVisionPalette(); }
    </script>
    <!-- end inject -->  
    HEADERS
#    @content_for_header = ""    
  end
    
  def template_path
    "#{THEMES}/#{@theme}/templates"
  end
  
  def template_considering_cookies
    if cookie = @request.cookies.find { |c| c.name == "template_#{@action_name}" }
      cookie.value
    else
      @action_name
    end    
  end
  
  def path_scan
    
    matches = @request.path_info.gsub(/\+/,' ').scan(/\/([\w\s\-\.\+]+)/).flatten
    puts "matches: #{matches.inspect}"
    @action_name      = matches[0] if matches[0]
    @params['handle'] = matches[1] if matches[1]
    @params['tags']   = matches[2] if matches[2]

    @action_name = 'collection' if @action_name == 'collections'
    @action_name = 'product'    if @action_name == 'products'
    @action_name = 'page'       if @action_name == 'pages'
    if @action_name == 'blogs'
      if matches[2]
        @params['article'] = matches[2]
        @action_name = "article"
      else
        @action_name = 'blog'
      end
    end
  end
  
end

