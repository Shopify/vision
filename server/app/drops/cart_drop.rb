class CartDrop < Liquid::Drop    
  
  def total_price
    items.inject(0) { |sum, item| sum += item['line_price'] * item['quantity'] }
  end
  
  def item_count
    items.inject(0) { |sum, item| sum += item['quantity'] }
  end
  
  def items
    Database.find(:all, :line_items)
  end
  
end