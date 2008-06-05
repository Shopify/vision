class PageCollectionDrop < Liquid::Drop        
  def before_method(value)    
    if page = Database.find(:all, :pages).find {|l| l['handle'] == value}
      page
    else
      {'id' => 0, 'title' => "Unknown Page '#{value}'"}
    end
  end
end
