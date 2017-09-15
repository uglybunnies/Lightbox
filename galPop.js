(function(){
    "use strict";
    var self;
    var UB = UB || {};
    self = UB.GALLERY = {
        init : function() {
            // collect all the links that point to the full-size image
            var galLinks = document.querySelectorAll('#gallery a.galPic');
            self.bind(galLinks);
        },
        bind : function(galLinks) {
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
                        return self.popPic(el, galLinks);
                    }
                });
            });
        },
        popPic : function(o, galLinks) {
            var galPic = o.pics;
            var box = document.createDocumentFragment();
            var screen = document.createDocumentFragment();
            var galScreen = self.createElem('div', 'galScreen', 'galb');
            screen.appendChild(galScreen);
            var galBox = self.createElem('div', 'galBox', 'galb'); // main container for the image box
            var galPics = self.createElem('div', 'pb', 's4'); 		  // image box
            var closeP = self.createElem('p', 'closeP');			  // close control paragraph
            var closeLink = self.createElem('a');			  // close control
            closeLink.setAttribute('href', '#');
            closeLink.textContent = 'close';
            closeP.appendChild(closeLink);			      // append close control to the paragraph
            galPic.id = 'pPic';                           // larger image
            galPic.src = o.pics.src;
            galPic.classList.add('show');
            var capP = self.createElem('p', 'capP');				  // caption paragraph
            var navP = self.createElem('p', 'navP');				  // navigation control paragrah
            var prevLink = self.createElem('a');            //prev link
            prevLink.href = o.pLink.href;
            prevLink.setAttribute('title', 'view previous image');
            prevLink.textContent = '\u00AB prev';
            var nextLink = self.createElem('a');            // next link
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
            closeLink.addEventListener('click', function(e) { // close link function
                e.preventDefault();
                self.closeGallery(galScreen, galBox);
            });
            galBox.addEventListener('click', function() {  // close on click away
                self.closeGallery(galScreen, galBox);
            });
            nextLink.addEventListener('click', function(e) { // next link instructions
                e.preventDefault();
                var me = o.nLink;
                var picIndex = me.index;
                this.href = me.nLink.href;
                prevLink.href = me.pLink.href;
                galPic.classList.toggle('show');
                self.swapPic(me, picIndex, galPic, capP, galLinks);
                o = me;
            });
            prevLink.addEventListener('click', function(e) { // previous link instructions
                e.preventDefault();
                var me = o.pLink;
                var picIndex = me.index;
                this.href = me.pLink.href;
                nextLink.href = me.nLink.href;
                galPic.classList.toggle('show');
                self.swapPic(me, picIndex, galPic, capP, galLinks);
                o = me;
            });
        },
        createElem : function(el, id, className) {
            var o = document.createElement(el);
            if(className) {
                o.className = className;
            }
            if(id) {
                o.id = id;
            }
            return o;
        },
        closeGallery : function(screen, box){
            screen.classList.toggle('show');
            box.classList.toggle('show');
            screen.addEventListener('transitionend', function(){
                document.body.removeChild(screen);
                document.body.removeChild(box);
            });
        },
        swapPic : function(o, i, galPic, capP, galLinks){
            galPic.addEventListener('transitionend', function() {
                galPic.src = galLinks[i].getAttribute('href');
                galPic.classList.toggle('show');
                var text= o.pics.getAttribute('alt');
                capP.textContent = text;
            }, {once: true});
        }

    };
    UB.GALLERY.init();
})();
