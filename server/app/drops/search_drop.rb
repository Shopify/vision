class SearchResultDrop < Liquid::Drop      
  def performed
    true
  end

  def results
    [ Database.find(7, "products"), Database.find(8, "products")]
  end
  
  def results_count
    2
  end
  
  def terms
    'clothing'
  end       
end