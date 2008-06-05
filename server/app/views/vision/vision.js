var Vision = {
  Version: '0.9'
}

Vision.Palette = Class.create();
Vision.Palette.prototype = {
  initialize: function(rhtml, options) {
    this.rhtml = rhtml;
    Event.observe(window, 'load', this.onLoad.bindAsEventListener(this));
  },

  onLoad: function(event) {
    new Insertion.Bottom(document.body, this.rhtml);
    
    this.search       = $('find');
    this.cachedValues = {
      search: $F(this.search)
    }    
        
    // Change the theme
    Event.observe(this.search, 'focus', this.onTextFieldFocus.bindAsEventListener(this));
    Event.observe(this.search, 'blur', this.onTextFieldBlur.bindAsEventListener(this));
  },
  
  onTextFieldFocus: function(event) {
    Field.clear(Event.element(event));
  },
  
  onTextFieldBlur: function(event) {
    Event.element(event).value = this.cachedValues.search;
  },
  
  refresh: function() {
    var loc = window.location.href.gsub(/#/, '');
    window.location.href = loc;
  }
}

var Cookie = {    
  set: function(name, value, expires, path, domain, secure) {
    path = path != null ? path : "/"
    document.cookie= name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  },
  
  get: function(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
    } else {
      begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end)).split("+").join(" ");
  },
  
  destroy: function(name, path, domain) {
    if (this.get(name)) {
      path = path != null ? path : "/"
      document.cookie = name + "=" + 
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
  }
}

new Vision.Palette(vision_html);

