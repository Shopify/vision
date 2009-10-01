class CollectionCollectionDrop < Liquid::Drop    
    
  def before_method(value)    
    collection = Database.find(:all, :collections).find {|l| l['handle'] == value}    
    collection['tags'] = collection['products'].collect { |p| p['tags'] }.flatten.uniq
    collection['products_count'] ||= collection['products'].size
    collection
  end

  def each
    Database.find(:all, :collections).each { |c| yield c }
  end
  
  def size
    Database.find(:all, :collections).size
  end
end
