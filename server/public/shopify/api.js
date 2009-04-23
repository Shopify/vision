/* 
  visit yourstore.com/shopify/api.html for demo and examples 
*/
if ((typeof Shopify) == 'undefined') {
  var Shopify = {};
}

/* 

override so that Shopify.formatMoney returns pretty 
money values instead of cents  

*/

Shopify.money_format = "$ {{amount}}";

/* 

Events (override!) 

Example override:
  ... add to your theme.liquid's script tag....

  Shopify.onItemAdded = function(line_item) {	    
    $('message').update('Added '+line_item.title + '...');	    
  }	  
*/	

Shopify.onError = function(error) {    
  alert('Error: ' + error.message);
},

Shopify.onCartUpdate = function(cart) {
  alert("There are now "+ cart.item_count + " items in the cart.");    
},  

Shopify.onItemAdded = function(line_item) { 
  alert(line_item.title + ' Was added to your shopping cart');
},

Shopify.onProduct = function(product) {
  alert('Received everything we ever wanted to know about '+ product.title);
},

/* Tools */

Shopify.formatMoney = function(cents, format) {
  var value = '';
  var patt = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);
  switch(formatString.match(patt)[1]) {
  case 'amount':
    value = floatToString(cents/100.0, 2);
    break;
  case 'amount_no_decimals':
    value = floatToString(cents/100.0, 0);
    break;
	case 'amount_with_comma_separator':
		value = floatToString(cents/100.0, 2).replace(/\./, ',');
		break;
  }    
  return formatString.replace(patt, value);
},

Shopify.resizeImage = function(image, size) {
  try {
    if(size == 'original') { return image; }
    else {      
      var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
      return matches[1] + '_' + size + '.' + matches[2];
    }    
  } catch (e) { return image; }
},
/* API */
  
Shopify.addItem = function(variant_id, quantity, callback) {            
  var quantity = quantity || 1;
  new Ajax.Request("/cart/add.js", this.params('post', 'quantity='+quantity+'&id='+variant_id, callback || this.onItemAdded.bind(this)));
}, 

Shopify.addItemFromForm = function(form_id, callback) {        
  new Ajax.Request("/cart/add.js", this.params('post', Form.serialize(form_id), callback || this.onItemAdded.bind(this)));
},

Shopify.getCart = function(callback) {
  new Ajax.Request("/cart.js", this.params('get', null, (callback || this.onCartUpdate.bind(this))));
},  

Shopify.getProduct = function(handle, callback) {
  new Ajax.Request("/products/"+handle+'.js', this.params('get', null, (callback || this.onProduct.bind(this))));
},  

Shopify.changeItem = function(variant_id, quantity) {            
  new Ajax.Request("/cart/change.js", this.params('post', 'quantity='+quantity+'&id='+variant_id, this.onCartUpdate.bind(this)));
},  

Shopify.removeItem = function(variant_id) {            
  new Ajax.Request("/cart/change.js", this.params('post', 'quantity=0&id='+variant_id, this.onCartUpdate.bind(this)));
},              


Shopify.clear = function() {            
  new Ajax.Request("/cart/clear.js", this.params('post', '', this.onCartUpdate.bind(this)));
},

Shopify.updateCart = function(updates, callback) {
  var query = '';

  if(updates.type == Array) {    
    $A(array).flatten().each(function(qty) { 
      query += ('updates[]=' + qty.toString()) + "&" ;
    }); 
  }
  else if (updates.type == Object) {
    $H(array).flatten().each(function(id, qty) { 
      query += ('updates['+id.toString()+']=' + qty.toString()) + "&" ;
    });       
  }
  else {
    throw "updates parameter must be array of quantities or a hash of {item_ids: quantities}"
  }

  new Ajax.Request("/cart/update.js", this.params('post', query, (callback || this.onCartUpdate.bind(this))));
},

Shopify.updateCartFromForm = function(form_id, callback) {
  new Ajax.Request("/cart/update.js", this.params('post', Form.serialize(form_id) , (callback || this.onCartUpdate.bind(this))));
}

/* private */

Shopify.params = function(method, parameters, callback) {       

  var hash = {
    method:       (method || 'post'),
    parameters:   (parameters || ''),
    evalScripts:  false,
    asynchronous: true,
    requestHeaders: { 
      'If-Modified-Since': "Sat, 1 Jan 2000 00:00:00 GMT"
    }
  };           


  if(callback == null){
    callback = this.onDebug.bind(this);
  }

  hash.onSuccess = function(t) {      
    try {  callback($(eval('(' +t.responseText+')')));  }
    catch(e) { alert("API Error: " + e + "\n\n"+t.responseText); };      
  }.bind(this);

  hash.onFailure = function(t) {
    try {  this.onError($(eval('(' +t.responseText+')'))); }
    catch(e) { alert("API Error: " + e + "\n\n"+t.responseText); };             
  }.bind(this);

  return hash;
}
  
function floatToString(numeric, decimals) {  
  var amount = numeric.toFixed(decimals).toString();  
  if(amount.match(/^\.\d+/)) {return "0"+amount; }
  else { return amount; }
}
  
