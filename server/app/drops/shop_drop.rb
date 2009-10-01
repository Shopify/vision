class ShopDrop < Liquid::Drop    
  
  def name
    'Foo Shop'
  end
  
  def currency
    'USD'
  end
  
  def domain
    'vision.shopify.com'
  end
  
  def url
    'http://vision.shopify.com'    
  end
  
  def money_with_currency_format
    "$ {{amount}} USD"
  end
  
  def products_count
    5
  end
  
  def collections_count
    5
  end
  
end
