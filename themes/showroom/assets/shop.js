Ajax.Responders.register({
  // Show progress indicator and hide 
  // all other notices 
  onLoading: function() {
    document.body.addClassName('loading');
  },
  
  onComplete: function() {
    document.body.removeClassName('loading');
  }    
});


Shopify.onError = function(error) {    
  alert('Error: ' + error.message);
}
  
Shopify.onCartUpdate = function(cart) {
  if (!$('cart').visible()) {
    Showroom.showCart();      
  }
  
  $('cart-total').innerHTML = Shopify.formatMoney(cart.total_price);
  $('cart-quantity').innerHTML = cart.item_count;

  $A($('cart-items').childNodes).each(function(node) { $('cart-items').removeChild(node); });
  
  if(cart.items.length > 0) {
    
    cart.items.each(function(item) {
    
      itemDiv           = document.createElement('div');
    	itemDiv.className = 'cart-item';
    	itemDiv.id        = 'item-'+item.variant_id;

    	itemDiv.innerHTML = '<div class=\"cart-item-image\">'+
                       '<a href=\"'+item.url+'\"><img src=\"' + Shopify.resizeImage(item.image, 'thumb') + '\" alt=\"' + item.title + '\" /></a>' +
    						       '</div>' +
     						       item.quantity + 'x<br /><small><a href=\"'+item.url+'\">' + item.title.truncate(18) + '</a><br />' +
     						       '<span class="dark-link"><a href=\"/cart/change/'+item.variant_id+'?quantity=0\" onclick=\"Shopify.removeItem(' + item.variant_id + ');return false\">remove</a></span></small>';      
    
      $('cart-items').appendChild(itemDiv);
    });
  
  } else {
    Showroom.hideCart();
  }
}  
  
Shopify.onItemAdded = function(line_item) { 

  Shopify.getCart(function(cart){
    Shopify.onCartUpdate(cart);
    
    if($('item-'+line_item.variant_id)) {
      new Effect.Pulsate($('item-' + line_item.variant_id).firstChild, { duration: 1.0, pulses: 3 });    
    }

  });
}

var Showroom = { 

  toggleCart: function() {
    if (!$('cart').visible()) {
      this.showCart();
    } else {
      this.hideCart();
    }
  },
  
  hideCart: function() {    
    new Effect.BlindUp($('cart'));
    $('page').removeClassName('show-cart');
  },
  
  showCart: function() {
    new Effect.BlindDown($('cart'));
    $('page').addClassName('show-cart');
  },
  
  onVariantChange: function(select) {
    $('product-lightbox-price').update((select.options[select.selectedIndex]).title);
  },
  
  updatePrice: function(product_id) {
    var field = $('product-quantity-'+product_id);
    $('price-field-'+product_id).innerHTML = Shopify.formatMoney($('price-'+product_id).value * field.options[field.selectedIndex].text);
  }
}
