// All of these methods have been deprecated

if (!window.Area) {
  var Area = new Object();
}

Object.extend(Area, {
  //see Display.showContent
  showContent: function(base_name) {
    Element.hide(base_name + '_label');
    new Effect.BlindDown($(base_name + '_content'), {duration:0.2});
  },                                                         

  // see Display.hideContent
  hideContent: function(base_name){
    new Effect.BlindUp(base_name + '_content', {duration:0.1});
    Element.show(base_name + '_label');
  }
})

/*-------------------- Design ------------------------------*/
if(!window.Design) {
  var Design = new Object();
}

Object.extend(Design, {
  toggleTextBox: function(element, textbox) {
    Element.Class.toggle(textbox, 'short', 'tall');
    if(element.innerHTML.toLowerCase() == "more room")
      element.innerHTML = "Less room"
    else
      element.innerHTML = "More room"
  }
});

/*-------------------- Display ------------------------------*/

if(!window.Display) {
  var Display = new Object();
}

Object.extend(Display, {
  scroll_to: function(element)
  {
    new Effect.ScrollTo(element);
  }
})



/*-------------------- Toggle Functions ------------------------------*/
/* lets deprecate those */
function toggle_with_effect(id, visibility) {
  if (visibility)
    { new Effect.Appear(id, {duration: 0.3}); }
  else
    { Element.hide(id) }            
}

function toggle_with_slide_effect(id, visibility) {
  if (visibility)
    { new Effect.BlindDown(id, {duration: 0.3}); Element.show(id); }
  else
    { new Effect.BlindUp(id, {duration: 0.3}); Element.show(id); }
}

function toggle(id, visibility) {
  if (visibility)
    { Element.show(id) }
  else
    { Element.hide(id) }
}  
                     
