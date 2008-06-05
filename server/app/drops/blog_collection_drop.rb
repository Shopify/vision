class BlogCollectionDrop < Liquid::Drop        
  def before_method(value)    
    if blog = Database.find(:all, :blogs).find {|l| l['handle'] == value}
      blog
    else
      {'id' => 0, 'title' => "Unknown blog '#{value}'"}
    end
  end
end
