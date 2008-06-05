class CollectionCollectionDrop < Liquid::Drop    
    
  def before_method(value)    
    collection = Database.find(:all, :collections).find {|l| l['handle'] == value}    
    collection['tags'] = collection['products'].collect { |p| p['tags'] }.flatten.uniq
    collection['products_count'] ||= collection['products'].size
    collection
  end
end
