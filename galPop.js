(function(){
// collect all the links that point to the full-size image
    var galLinks = document.querySelectorAll('#gallery a.galPic');
// iterate over the links and perform these instructions for each
    galLinks.forEach(function(el, i) {
//create a new image object for pre-caching
        el.pics = new Image();
//set the src for each image object
        el.pics.src = el.getAttribute('href');
//set the photo caption based on the thumb image alt attribute
        el.capt = el.querySelector('img').getAttribute('alt');
//set the larger image alt attribute to match that of the thumb
        el.pics.setAttribute('alt', el.capt);
//set the next image link information
        el.nLink = (i === galLinks.length - 1 ? galLinks[0] : galLinks[i+1]);
//set the previous image link information
        el.pLink = (i === 0 ? galLinks[galLinks.length - 1] : galLinks[i - 1]);
        el.index = i;
//set the click event handler to run popPicBox function and prevent the default behavior
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var showing = document.getElementById('galScreen');
            if (!showing) {
                return popPicBox(el, galLinks);
            }
        });
    });
})();
var popPicBox = function(o, galLinks) {
    var galPic = o.pics;
    var box = document.createDocumentFragment();
    var screen = document.createDocumentFragment();
    var galScreen = createElem('div', 'galScreen', 'galb');
    screen.appendChild(galScreen);
    var galBox = createElem('div', 'galBox', 'galb'); // main container for the image box
    var galPics = createElem('div', 'pb', 's4'); 		  // image box
    var closeP = createElem('p', 'closeP');			  // close control paragraph
    var closeLink = createElem('a');			  // close control
    closeLink.setAttribute('href', '#');
    closeLink.textContent = 'close';
    closeP.appendChild(closeLink);			      // append close control to the paragraph
    galPic.id = 'pPic';                           // larger image
    galPic.src = o.pics.src;
    galPic.classList.add('show');
    var capP = createElem('p', 'capP');				  // caption paragraph
    var navP = createElem('p', 'navP');				  // navigation control paragrah
    var prevLink = createElem('a');            //prev link
    prevLink.href = o.pLink.href;
    prevLink.setAttribute('title', 'view previous image');
    prevLink.textContent = '\u00AB prev';
    var nextLink = createElem('a');            // next link
    nextLink.href = o.nLink.href;
    nextLink.setAttribute('title', 'view next image');
    nextLink.textContent = 'next \u00BB';
    navP.append(prevLink, nextLink);             // append the links
    galPics.append(closeP, navP, galPic, capP);  // append the p's and img
    galBox.appendChild(galPics);				 // append the image box to the container
    box.appendChild(galBox);
    document.body.appendChild(screen);           // append the screen
    document.body.appendChild(box);				 // append the image box
    galBox.classList.add('show');
    galScreen.classList.add('show');
// add event handlers and instructions for the controls
	galPics.addEventListener('click', function(e) {
		e.stopPropagation();					 // keep clicks from bubbling up
	});
    closeP.addEventListener('click', function(e) { // close link function
        e.preventDefault();
        closeGallery();
    });
    galBox.addEventListener('click', function() {  // close on click away
        closeGallery();
    });
    nextLink.addEventListener('click', function(e) { // next link instructions
        e.preventDefault();
        var me = o.nLink;
        var picIndex = me.index;
        this.href = me.nLink.href;
        prevLink.href = me.pLink.href;
        galPic.classList.toggle('show');
        swapPic(me, picIndex, galPic, capP, galLinks);
        o = me;
    });
    prevLink.addEventListener('click', function(e) { // previous link instructions
        e.preventDefault();
        var me = o.pLink;
        var picIndex = me.index;
        this.href = me.pLink.href;
        nextLink.href = me.nLink.href;
        galPic.classList.toggle('show');
        swapPic(me, picIndex, galPic, capP, galLinks);
        o = me;
    });
};
var createElem = function(el, id, className){
    var o = document.createElement(el);
    if(id) {
        o.id = id;
    }
    if(className) {
        o.className = className;
    }
    return o;
};
var closeGallery = function() {
    galScreen.classList.toggle('show');
    galBox.classList.toggle('show');
    galScreen.addEventListener('transitionend', function(){
        document.body.removeChild(galScreen);
        document.body.removeChild(galBox);
    });
};
var swapPic = function(o, i, galPic, capP, galLinks) {
    galPic.addEventListener('transitionend', function() {
        galPic.src = galLinks[i].getAttribute('href');
        galPic.classList.toggle('show');
        var text= o.pics.getAttribute('alt');
        capP.textContent = text;
    }, {once: true});
};
