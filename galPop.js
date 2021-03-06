/*
  append() method Polyfill
  Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
*/
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function append() {
                var argArr = Array.prototype.slice.call(arguments),
                docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });
                this.appendChild(docFrag);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
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
                // set index to be able to target specific pics
                el.index = i;
                //set the click event handler to run popPic function and prevent the default behavior
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
            var galPic = o.pics; // get the image object
            // document fragments used to reduce redrawing in the browser.
            var box = document.createDocumentFragment();
            var screen = document.createDocumentFragment();
            var galScreen = self.createElem('div', 'galScreen', 'galb screen');
            screen.appendChild(galScreen);
            var galBox = self.createElem('div', 'galBox', 'galb container');  // main container for the image box
            var galPics = self.createElem('div', 'pb', 's4 modal'); 		  // image box
            var closeP = self.createElem('p', 'closeP', 'modal-header');	  // close control paragraph
            var closeLink = self.createElem('a', 'closeLink', 'close-modal'); // close control
            closeLink.setAttribute('href', '#');
            closeLink.textContent = 'close';
            closeP.appendChild(closeLink);			      // append close control to the paragraph
            galPic.id = 'pPic';                           // larger image
            galPic.src = o.pics.src;
            galPic.classList.add('full-pic', 'show');
            var capP = self.createElem('p', 'capP', 'caption');
            capP.textContent = o.capt;		                                    // caption paragraph
            var navP = self.createElem('p', 'navP', 'pic-nav');				    // navigation control paragrah
            var prevLink = self.createElem('a', 'prevLink', 'browse-pic prev'); //prev link
            prevLink.href = o.pLink.href;
            prevLink.setAttribute('title', 'view previous image');
            prevLink.textContent = '\u00AB prev';
            var nextLink = self.createElem('a', 'nextLink', 'browse-pic next'); // next link
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

            // add new events and event handlers for the controls
            var nextPic = new Event('next', {
                bubbles : true,
                cancelable : false
            });
            var prevPic = new Event('prev', {
                bubbles : true,
                cancelable : false
            });
            var closeModal = new Event('close', {
                bubbles : true,
                cancelable : false
            });
            // handle click on the closing control
            pb.addEventListener('close', function(e) {
                self.closeGallery(galScreen, galBox);
            });

            // handle click on the next link
            pb.addEventListener('next', function(e) {
                var me = o.nLink;
                var picIndex = me.index;
                self.updatePicLinks(me, nextLink, prevLink);
                self.swapPic(me, picIndex, galPic, capP, galLinks);
                o = me;
            });

            // handle click on the previous link
            pb.addEventListener('prev', function(e) {
                var me = o.pLink;
                var picIndex = me.index;
                self.updatePicLinks(me, nextLink, prevLink);
                self.swapPic(me, picIndex, galPic, capP, galLinks);
                o = me;
            });

            // set click event listener on the modal
            pb.addEventListener('click', function(e) {
                // don't follow the link href
                e.preventDefault();
                // keep clicks on the modal from bubbling up & triggering close function
                e.stopPropagation();
                var target = e.target;
                if (target.matches('.next')) {
                    target.dispatchEvent(nextPic);        // clicked on next
                }
                if (target.matches('.prev')) {
                    target.dispatchEvent(prevPic);        // clicked on prev
                }
                if (target.matches('.close-modal')) {
                    target.dispatchEvent(closeModal);     // clicked on close
                }
            });
            // close the modal if the user clicks on the overlay screen
            galBox.addEventListener('click', function() {
                self.closeGallery(galScreen, galBox);
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
            galPic.classList.toggle('show');
            galPic.addEventListener('transitionend', function() {
                galPic.src = galLinks[i].getAttribute('href');
                galPic.classList.toggle('show');
                var text= o.capt;
                capP.textContent = text;
            }, {once: true});
        },
        updatePicLinks : function(l, nextLink, prevLink) {
            nextLink.href = l.nLink.href;
            prevLink.href = l.pLink.href;
        }

    };
    UB.GALLERY.init();
})();
