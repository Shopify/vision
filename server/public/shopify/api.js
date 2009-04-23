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

/* default mock items for callbacks */
/* line_items.to_json =>  
    'id'        
    'title'     
    'price'      
    'line_price' 
    'quantity'   
    'sku'        
    'grams'      
    'vendor'     
    'variant_id'
    'url'
    'image'
    'handle'      
*/
Shopify.default_line_item = { 
  id: 1,
  title: 'Arbor Draft',
  price: 29900,
  line_price: 29900,
  quantity: 1,
  sku: "", 
  grams: 1000,
  vendor: "Arbor",
  variant_id: 1,
  image: "",
  url: "/products/arbor-draft",
  handle: "arbor-draft"
},

Shopify.default_cart = {
  "items": [
      {
        id: 1,
        title: 'Arbor Draft',
        price: 29900,
        line_price: 29900,
        quantity: 1,
        sku: "", 
        grams: 1000,
        vendor: "Arbor",
        variant_id: 1,
        image: "products/arbor_draft.jpg",
        url: "/products/arbor-draft",
        handle: "arbor-draft"
      },
      {
        id: 2,
        title: 'Comic ~ Orange',
        price: 19900,
        line_price: 39800,
        quantity: 2,
        sku: "", 
        grams: 1000,
        vendor: "Technine",
        variant_id: 5,
        image: "products/technine3.jpg",
        url: "/products/comic-orange",
        handle: "comic-orange"    
      }
  ],
  "total_price": 69700, 
  "attributes": {}, 
  "item_count": 2, 
  "note": "", 
  "total_weight": 400.0
},

Shopify.default_product = {
  "handle":"arbor-draft",
  "options": ["Length","Style"],
  "title":"Arbor Draft",
  "price":23900,
  "available":true,
  "tags":["season2005","pro","intermediate","wooden","freestyle"],
  "featured_image":"products\/arbor_draft.jpg",
  "type":"Snowboards",
  "url":"\/products\/arbor-draft",
  "id":1,
  "compare_at_price":49900,
  "price_varies":true,
  "compare_at_price_max":50900,
  "compare_at_price_varies":true,
  "images":["products\/arbor_draft.jpg"],
  "description":"The Arbor Draft snowboard wouldn't exist if Polynesians hadn't figured out how to surf hundreds of years ago. But the Draft does exist, and it's here to bring your urban and park riding to a new level. The board's freaky Tiki design pays homage to culture that inspired snowboarding. It's designed to spin with ease, land smoothly, lock hook-free onto rails, and take the abuse of a pavement pounding or twelve. The Draft will pop off kickers with authority and carve solidly across the pipe. The Draft features targeted Koa wood die cuts inlayed into the deck that enhance the flex pattern. Now bow down to riding's ancestors.",
  "price_max":31900,
  "variants": [
    { 
      "option2":"Normal",
      "option3":null,
      "available":true,
      "weight":1000,
      "price":19900,
      "title":"151cm \/ Normal",
      "inventory_quantity":5,
      "compare_at_price":49900,
      "id":1,
      "option1":"151cm"
    },
    { 
      "option2":"Normal",
      "option3":null,
      "available":true,
      "weight":1000,
      "price":31900,
      "title":"155cm \/ Normal",
      "inventory_quantity":2,
      "compare_at_price":50900,
      "id":2,
      "option1":"155cm"
    },
    {
      "option2":"Wide",
      "option3":null,
      "available":false,
      "weight":1000,
      "price":23900,
      "title":"158cm / Wide",
      "inventory_quantity":0,
      "compare_at_price":99900,
      "id":6,
      "option1":"158cm"
    }
  ],
  "vendor":"Arbor",
  "price_min":23900,
  "compare_at_price_min":49900
},


Shopify.addItem = function(variant_id, quantity, callback) {            
  var quantity = quantity || 1;
  var data = this.default_line_item;
  (callback) ? callback(data) : this.onItemAdded(data);
}, 

Shopify.addItemFromForm = function(form_id, callback) {        
  var data = this.default_line_item;
  (callback) ? callback(data) : this.onItemAdded(data);
},

Shopify.getCart = function(callback) {
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
},  

Shopify.getProduct = function(handle, callback) {
  var data = this.default_product;
  (callback) ? callback(data) : this.onProduct(data);
},

Shopify.changeItem = function(variant_id, quantity) { 
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
},

Shopify.removeItem = function(variant_id) {
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
},              


Shopify.clear = function() {            
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
},

Shopify.updateCart = function(updates, callback) {
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
},

Shopify.updateCartFromForm = function(form_id, callback) {
  var data = this.default_cart;
  (callback) ? callback(data) : this.onCartUpdate(data);
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
  
