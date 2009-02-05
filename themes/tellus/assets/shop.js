function displayImage(index, parent){
 	var images = document.getElementById(parent).getElementsByTagName("div");
	for(var i = 0; i < images.length; i++) {
	  var image = images[i];
	  if (image.className != 'pimage')  { continue }
	  if(i == index-1) {
	    image.style.display="block";
	  }
	  else {
	    image.style.display="none";
	  }		
	}	
}