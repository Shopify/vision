/*------------------------------------------------------------*/

if (!window.Element) {
  var Element = new Object();
}

if (!window.Form) {
  var Form = new Object();
}

Object.extend(Form, { 
  // Clear search string from a form 
  wipe: function(form){
    if(form.value == 'Search...') form.value = ''
  }
});

Object.extend(Element, { 

  // Returns true if the element is visible
  isVisible: function(element) {
    return $(element).style.display != 'none';
  },
  
  // Deprecated: See prototype.js getElementsByClassName(element, parent)
  getChildrenByClassName: function(element, className) {
    var nodes = element.childNodes;
    var node;
    for(var i = 0; i < nodes.length; i++) {
      if(nodes[i].nodeType == 1) {
        if(Element.hasClassName(nodes[i], className)) {
         return node = nodes[i];
        }
      }
    }
    return false;
  },

  // Traverse up the DOM finding the first parent with the 
  // tagName equal to tagName
  findFirstParentNamed: function(element, tagName) {
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },
  
  // Remove the GrandParent of the element that was passed.
  // Use min_size to control the minimum allowed length of the 
  // GrandParents children.  Good for when you want to have atleast 
  // a childnode present.
  removeGrandParent: function(element, min_size) {
    var gParent = element.parentNode.parentNode;
    var ggParent = gParent.parentNode;
    Element.cleanWhitespace(ggParent);
    
    if(min_size && ggParent.childNodes.length <= min_size)
      return;
    else
      ggParent.removeChild(gParent);
  },
  
  // Toggle the visibility of two elements in sync
  // Good for hiding one element in the precense of another
  togglePair: function(element1, element2) {
    Element.toggle(element1);
    Element.toggle(element2);
  }
});

/*-------------------- Area Functions ------------------------------*/

var Area = {
  
  // Clone an html element and insert it into a new 
  // position in the DOM
  cloneHTML: function(from, to, position) {
    var from = $(from);
    var to   = $(to);
    clone = from.cloneNode(true);
  
    switch(position.toLowerCase()) {
      case 'bottom': 
        to.appendChild(clone);
        return clone;
      case 'top'   : new Insertion.Top(to, clone);     break;
      case 'before': new Insertion.Before(to, clone);  break;
      case 'after' : new Insertion.After(to, clone);   break;
    }
    
    return clone;
  }
  
}


/*-------------------- Global Ajax Responders ------------------------------*/

// We use this primarily for auto handling of displaying error messages and 
// success text for Ajax request
Ajax.Responders.register({
  
  // Show progress indicator and hide 
  // all other notices 
  onLoading: function() {
    Element.show('ajax-notice');
    Element.hide('flash-errors');
    Element.hide('flash-notice');
  },
  
  // Hide progress indicator and if an error 
  // has occured, show that error
  onComplete: function(request) {
    Element.hide('ajax-notice');    
    if(request.transport.status != 200) {
      Messenger.error(request.transport.responseText);
    }    
  }
});

/*-------------------- Messenger Functions ------------------------------*/
// Messenger is used to manage error messages and notices
//
var Messenger = {
  // When given an error message, wrap it in a list 
  // and show it on the screen.  This message will auto-hide 
  // after a specified amount of miliseconds
  error: function(message) {
    $('flash-errors').innerHTML = '';
    $('flash-errors').innerHTML = "<li>" + message + "</li>";
    new Effect.Appear('flash-errors', {duration: 0.3});
    setTimeout(Messenger.fadeError.bind(this), 5000);
  },

  // Notice-level messages.  See Messenger.error for full details.
  notice: function(message) {
    $('flash-notice').innerHTML = '';
    $('flash-notice').innerHTML = "<li>" + message + "</li>";
    new Effect.Appear('flash-notice', {duration: 0.3});
    setTimeout(Messenger.fadeNotice.bind(this), 5000);
  },
  
  // Responsible for fading notices level messages in the dom    
  fadeNotice: function() {
    new Effect.Fade('flash-notice', {duration: 0.3});
  },
  
  // Responsible for fading error messages in the DOM
  fadeError: function() {
    new Effect.Fade('flash-errors', {duration: 0.3});
  }
}

/*-------------------- Feedback Functions ------------------------------*/

var Dialog = {
  showHelp: function(name, detail) {
    if ($(name+'-dialog')) {
      new Effect.BlindDown(name+'-dialog', {duration:0.2});
    }      
    else {
      new Ajax.Request('/admin/shared/'+name+'?detail='+detail, {evalScripts:true});
    }
  },
  
  showFeedback: function() {
    if ($('feedback-area')) {
      visibility = !Element.isVisible("feedback-area");

      if (visibility)
      {
        new Effect.BlindDown($("feedback-area"), {duration: 0.3});
        $("feedback_body").focus();
      }
      else
      {
        new Effect.BlindUp($("feedback-area"), {duration: 0.3});
      }
    }      
    else {
      new Ajax.Request('/admin/shared/feedback', {evalScripts:true});
    }
  }
}

/*-------------------- Province Functions ------------------------------*/

var Province = {
  province_details: function(index)
  {
    visibility = !Element.isVisible("province_edit"+index);
    
    toggle("province_summary"+index, !visibility);
    toggle("province_edit"+index, visibility);
    
    if (visibility)
      $('img'+index).src = '/images/admin/icons/arrow_down_small.png';
    else
      $('img'+index).src = '/images/admin/icons/arrow_right_small.png';
  }
}

/*-------------------- Shipping Functions ------------------------------*/

var Shipping = {
  
  reset_field: function()  {
    $('rate_name_new').value = "";
    $('rate_weight_low_new').value = "";
    $('rate_weight_high_new').value = "";
    $('rate_cents_new').value = "";
  },
  
  shipping_details: function(index)  {
    visibility = !Element.isVisible("shipping_details"+index);

    toggle("shipping_details"+index, visibility);
    toggle("shipping_rate_summary"+index, !visibility);
        
    if (visibility)
      $('img'+index).src = '/images/admin/icons/arrow_down_small.png';
    else
      $('img'+index).src = '/images/admin/icons/arrow_right_small.png';
  }

}

/*-------------------- Product Administration Functions ------------------------------*/

var Product = {
  
  // Create a div with the class name featured and 
  // position it over the featured image (firstChild) of the 
  // given parent.
  markFeaturedImage: function(parent)  {
    var star = Builder.node('div', {className: 'featured'});
    var list = $(parent);
    var current = list.firstChild;
    if(!current) return;
    Element.cleanWhitespace(list);
    images = $A(list.childNodes);
    images.each(function(image) {
      if(document.getElementsByClassName('featured', image).length != 0)
        image.removeChild(document.getElementsByClassName('featured', image)[0]);
    });
        
    current.style.position = "relative";
    current.appendChild(star);
  },
  
  remove_image: function(mediafile)  {
    new Effect.Fade(mediafile,{duration: 0.4});
    setTimeout('Product.markFeaturedImage()', 1050);
  }
}

/*-------------------- Label Administration Functions ------------------------------*/

var Label = {
	
	markFeaturedLabel: function(product_id, label_id)	{
		if ($('featured_'+product_id).innerHTML == 'true') {
			$('feature_image_'+product_id).src='/images/admin/icons/empty_star.png'; 
			$('featured_'+product_id).innerHTML = 'false';
		}
		else {
			$('feature_image_'+product_id).src='/images/admin/icons/star.png'; 
			$('featured_'+product_id).innerHTML = 'true';
		}
		
		new Ajax.Request('/admin/labels/mark_featured/'+label_id, {parameters: 'product='+product_id+'&value='+$('featured_'+product_id).innerHTML });
	},
	
	createSortable: function(label_id, labelname)	{
		Sortable.create('assoc',{dropOnEmpty: true, containment: ['searchproducts','assoc'],
			onUpdate:function(){new Ajax.Request("/admin/labels/refresh_products/"+label_id,{evalScripts:true, parameters:Sortable.serialize('assoc')})}});
	
		Droppables.add('assoc', { accept: 'alt_products'	});
  }
}

/*--------------------------------------------------------------------*/

var Design = {
  editTemplate: function(element) {
    Display.toggleWithEffect(element);
    Display.scrollTo(element);
  },
  
  // Disable the submit button
  saving: function(element) {
    $(element).disabled = "disabled";
  },
  
  // When the request is complete fade a red box or green box 
  // depending on the response
  complete: function(request, btn, textarea) {
    if(request.status == 500) {
      new Effect.Highlight($(textarea), {startcolor: "#ff0000"});
    } else {
      $(btn).removeAttribute('disabled');
      new Effect.Highlight($(textarea), {startcolor: "#0EAF1B"});
    }
  }
}


/*---------------------------------------------------------------------*/
var SmartForm = {
  line_id: 0,
  
  addLine: function(field, relation, conditions) {
    this.line_id++;
    //   var row = Area.cloneHTML('template-row', 'smartlabelform', 'bottom');
    //   var template = $('template-form').innerHTML
    new Insertion.Bottom('smartlabelform', this.template(this.line_id));
    var line = $('line-' + this.line_id);
    new SmartForm.LabelLine(line, field, relation, conditions);
  },

  removeLine: function(id) {
    Element.remove('line-'+id);
  },

  template: function(id) {
    return '' +
    '<li id="line-'+id+'">' +
      '<span class="tools">' + 
        '<a href="#" onclick="SmartForm.addLine(); return false;"><img alt="Add" src="/images/administration/icons/add.png" /></a>' + 
        '<a class="del" href="#" onclick="SmartForm.removeLine('+id+'); return false;" title="Remove this"><img alt="Delete" src="/images/administration/icons/delete.png" /></a>' + 
      '</span>' +      
      '<select name="label[field][]" class="field">' +
        '<option value="products-title">Product\'s title</option>' +
        '<option value="products-product_type">Product\'s type</option>' +
        '<option value="products-vendor">Product\'s vendor</option>' +
        '<option value="product_variants-title">Variant\'s title</option>' +
        '<option value="product_variants-original_price">Variant\'s list price</option>' +
        '<option value="product_variants-price">Variant\'s selling price</option>' +
        '<option value="product_variants-weight">Variant\'s weight</option>' +
        '<option value="product_variants-inventory_quantity">Inventory stock</option>' +
      '</select>' +
      '' +
      '<select name="label[relation][]" style="display:none;" class="relation">' +
        '<option value="equals">is equal to</option>' +
        '<option value="greater_than">is greater than</option>' +
        '<option value="less_than">is less than</option>' +
      '</select>' +
      '' +
      '<select name="label[str_relation][]" style="display:none" class="strrelation">' +
        '<option value="equals">is equal to</option>' +
        '<option value="contains">contains</option>' +
        '<option value="starts_with">starts with</option>' +
        '<option value="ends_with">ends with</option>' +
      '</select>' +
      '' +
      '<input name="label[condition][]" style="display:none;" class="condition" />' +
    '</li>';
  }

}

SmartForm.LabelLine = Class.create();
SmartForm.LabelLine.prototype = {  
  
  line: null,

  initialize: function(line, field, relation, conditions) {
    this.line = line;
    
    if (field && relation && conditions ) {
      this.selectByString(this.fieldSelect(), field)
      this.selectByString(this.relationSelect(), relation)
      this.selectByString(this.strRelationSelect(), relation)
      this.conditionsInput().value = conditions;
    }

    this.registerObservers();
    this.onFieldChange(null, this.fieldSelect().value);
  },

  registerObservers: function() {
    new Form.Element.EventObserver(this.fieldSelect(this.line), this.onFieldChange.bind(this));
  },

  selectByString: function(element, value) {
    for(var i = 0; i < element.options.length; i++) {
      if (element.options[i].value == value) {
       element.selectedIndex = i;
       return;
    }}
  },

  onFieldChange: function(element, value) {

    this.hideEverything();
    
    if (this.typeOfField(value) == 'string') {
      this.onStringTypeSelect();
    }
    else {
      this.onNumberTypeSelect();  
    }
  },

  typeOfField: function(value) {
    switch(value.toLowerCase()) {
      case 'products-title': 
      case 'products-product_type':
      case 'products-vendor':
      case 'products_variant-title':
        return 'string'
      case 'product_variants-original_price':
      case 'product_variants-price':  
      case 'product_variants-weight':
      case 'product_variants-inventory':
        return 'numeric'
    }    
    return null;
  },

  onStringTypeSelect: function() {
    Element.show(this.strRelationSelect(this.line));
    Element.show(this.conditionsInput(this.line));
  },

  onNumberTypeSelect: function(element) {
    Element.show(this.relationSelect(this.line));
    Element.show(this.conditionsInput(this.line));
  },

  fieldSelect: function() {
    return document.getElementsByClassName('field', this.line)[0];
  },

  relationSelect: function() {
    return document.getElementsByClassName('relation', this.line)[0];
  },

  strRelationSelect: function() {
    return document.getElementsByClassName('strrelation', this.line)[0];
  },

  conditionsInput: function() {
    return document.getElementsByClassName('condition', this.line)[0];
  },

  hideEverything: function(element) {
    Element.hide(this.conditionsInput());
    Element.hide(this.relationSelect());
    Element.hide(this.strRelationSelect());
  }
}


/*--------------------------------------------------------------------*/

//Display controls the visual appearance of elements on the screen.
//It's primary purpose is to show and hide different sets of elements 
//with different styles and effects.

var Display = {
  
  showWithEffect: function(element) {
    new Effect.Appear(element, {duration: 0.3})
  },

  hideWithEffect: function(element) {
    new Effect.Fade(element, { duration: 0.15});
  },           

  toggleWithEffect: function(element, hide, visibility) {
    if (hide != null) this.hideGroup(hide);
    
    if(visibility != null) {
      if (visibility) { this.showWithEffect(element); } else { this.hideWithEffect(element); }
    } 
    else {      
      if($(element).style.display == 'none') { this.showWithEffect(element);} else { this.hideWithEffect(element); }
    }        
  },            
  
  toggleBlock: function(name) {
    Element.toggle(name + '-view');
    Element.toggle(name + '-edit');
  },
  
  scrollTo: function(element) {
    new Effect.ScrollTo(element);
  },
  
  //Hides a group of elements
  //Expects a string of 1 element ("ele"), or an array of strings(["ele1", "ele2"])
  hideGroup: function(elements) {
    if (elements.constructor == Array) {
      for (var i = 0; i < elements.length; i++) {
        Element.hide(elements[i]);
      }
    } else {
      Element.hide(elements);
    }
  },

  //Hides elements by className.
  //TODO: Allow the ability to exclude elements by Id
  hideByClassName: function(className) {
    var elements = document.getElementsByClassName(className);
    if(elements.length > 1) 
      this.hideGroup(elements);
    else
      this.hide(elements);
  },

  hideChildrenByClassName: function(element, className) {
    var elements = Element.getChildrenByClassName(element, className);
    this.hideGroup(elements);
  },
  
  showContent: function(base_name) {
    Element.hide(base_name + '_label');
    new Effect.Appear($(base_name + '_content'), {duration:0.3});
  },                                                         
  
  hideContent: function(base_name) {
    new Effect.Fade(base_name + '_content', {duration:0.3});
    Element.show(base_name + '_label');
  }
}


/*--------------------------------------------------------------------*/

Object.extend(Form.Element, {
  
  // Toggle height of a form input where element is the 
  // element that fired the event and target is the input you want 
  // to toggle.
  //
  toggleHeight: function(element, target) {
    Element.Class.toggle(target, 'short', 'tall');
		Element.Class.toggle(element, 'less', 'more');
    if(element.innerHTML.toLowerCase() == "more room to type")
      element.innerHTML = "Less room to type"
    else
      element.innerHTML = "More room to type"
  }
});