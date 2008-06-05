class LinkListCollectionDrop < Liquid::Drop        
  def before_method(value)    
    if menu = Database.find(:all, :link_lists).find {|l| l['handle'] == value}
      menu
    else
      {'id' => 0, 'title' => "Unknown Menu '#{value}'", 'links' => []}
    end
  end
end
