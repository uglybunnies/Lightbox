$(function(){
//detect all the links that point to the full-size image
    var galLinks = $('#gallery a.galPic');
//iterate over the galLinks and perform these instructions for each
    $(galLinks).each(function(i){
//create a new image object for pre-caching
        this.pics=new Image();
//set the src for each image object
        this.pics.src=this.href;
//set the photo caption based on the thumb image alt attribute
        this.capt=$(this).children('img').attr('alt');
//set the larger image alt attribute to match that of the thumb
        $(this.pics).attr('alt',this.capt);
//set the next image link information
        this.nLink = (i === galLinks.length-1 ? galLinks[0] : galLinks[i+1]);
//set the previous image link information
        this.pLink = (i === 0 ? galLinks[galLinks.length-1] : galLinks[i-1]);
//set the click event handler to run popPicBox function and prevent the default behavior
        $(this).click(function(e){
            e.preventDefault();
            return popPicBox(this);
        });
    });
});
var popPicBox = function(o){
//create and append the various elements required to display the lightbox
    var galScreen = $('<div id="galScreen" class="galb"></div>'); // transparent overlay screen
    var galBox = $('<div id="galBox" class="galb"></div>');		  // main container for the image box
    var galPics = $('<div id="pb" class="s4"></div>'); 			  // image box
    var closeP = $('<p id="closeP"></p>');						  // close control paragraph
    var closeLink =$('<a href="#">close</a>');					  // close control
    $(closeP).append(closeLink);								  // append close control to the paragraph
    var galPic = $('<img id="pPic" src="'+o.pics.src+'">');		  // larger image tag
    var capP = $('<p id="capP">'+o.capt+'</p>');				  // caption paragraph
    var navP = $('<p id="navP"></p>');							  // navigation control paragrah
    var prevLink = $('<a href="'+o.pLink.href+'" title="view previous image">&#171; prev</a>'); //prev link
    var nextLink= $('<a href="'+o.nLink.href+'" title="view next image">next &#187;</a>'); // next link
    $(navP).append(prevLink).append(nextLink);					  // append the links
    $(galPics).append(closeP).append(navP).append(galPic).append(capP); // append the p's and img
    $(galBox).append(galPics);									  // append the image box to the container
    $('body').append(galScreen);								  // append the screen
    $('body').append(galBox);									  // append the image box
// add event handlers and instructions for the controls
	$(galPics).click(function(e){
		e.stopPropagation();									  // keep clicks from bubbling up
	});
    $(closeP).click(function(e){								  // close link function
        e.preventDefault();
        $(galBox).fadeOut(300);
        $(galScreen).fadeOut(300, function(){
           $(galScreen).remove();								  // just remove these from the DOM
           $(galBox).remove();
        });
    });
    $(galBox).click(function(){									  // close on click away
        $(galBox).fadeOut(300);
        $(galScreen).fadeOut(300, function(){
           $(galScreen).remove();								  // just remove these from the DOM
           $(galBox).remove();
        });
    });
    $(nextLink).click(function(e){								  // next link instructions
        e.preventDefault();
        o = o.nLink;							// reset the current img reference to the next one
        $(galPic).fadeOut(250, function(){		// fade the image out
            $(this).attr('href',o.nLink.href);	// reset the href of the next img href
            prevLink.href = o.pLink.href;		// reset the href of the previous img href
            $(this).attr('src',o.pics.src);		// reset the current img src the this src
        });
        $(galPic).fadeIn(250);					// fade the image in
        var text=($(o.pics).attr('alt')) ? $(o.pics).attr('alt') : ''; // capture the alt for the caption
        $(capP).text(text);						// change the caption
    });
    $(prevLink).click(function(e){								  // previous link instructions
        e.preventDefault();
        o = o.pLink;							// reset the current img reference to the next one
        $(galPic).fadeOut(250,function(){		// fade the image out
            $(this).attr('href', o.pLink.href); // reset the href of the prev img href
            nextLink.href= o.nLink.href;		// reset the href of the next img href
            $(this).attr('src',o.pics.src);		// reset the current img src the this src 
        });
        $(galPic).fadeIn(250);					// fade the image in
        var text=($(o.pics).attr('alt')) ? $(o.pics).attr('alt') : ''; // capture the alt for the caption
        $(capP).text(text);						// change the caption
    });
};
