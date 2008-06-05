function add_to_cart(id, pid) {
	$('to_add' + pid).value=id;
	document.forms[ 'cart_form' + pid].submit();
}
function hover_color(id, color, textcolor){
	$( id ).style.backgroundColor=color;
	$( id ).style.color=textcolor;
}
function remove_item(id) {
     $('updates_'+id).value = 0;
     $('cartform').submit();
}
function calc(operator, ziel)
	{
	  var zahlFeld = $(ziel);
	  var wert     = zahlFeld.value;
		
	  if(operator == '-')
	  {
		if( wert == 1) {
		  ask = confirm('You are going to delete this product!')
		 	if(ask == true){
			 $(ziel).value = 0;
		     $('cartform').submit();
			}
		} else {
		  zahlFeld.value--;
		}
	   
	  }
	  else if(operator == '+')
	  {
	    zahlFeld.value++;
	  }
}
function displayimage(image, klutsch){
 	var l = document.getElementsByClassName(klutsch);
	for(i = 0; i < l.length; i++) {
		l[i].style.display="none";
	}	
	Element.show(image);
}
