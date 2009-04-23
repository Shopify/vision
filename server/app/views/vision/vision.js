var Vision = {
  Version: '0.9'
}

Vision.Palette = function(rhtml, options) {
  var body = document.getElementsByTagName('body')[0];
  var visiondiv = document.createElement('div');
  visiondiv.setAttribute('id','vision');
  visiondiv.innerHTML = rhtml;
  body.appendChild(visiondiv);
};

// remove bar from screen
Vision.remove = function() {
  var body = document.getElementsByTagName('body')[0];
  var el = document.getElementById('vision');
  if (el) {
    body.removeChild(el);
  }
};

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


function initVisionPalette() { 
  new Vision.Palette(vision_html);
};

