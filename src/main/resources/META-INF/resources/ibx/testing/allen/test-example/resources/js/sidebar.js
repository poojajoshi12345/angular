/**
 * Created by aw14286 on 9/19/2017.
 */
$(document)
    .ready(function ()
    {
       var sideCtrl = new ListBoxElement(".sidebar", ".sidebar-item");

    });

function ListBoxElement(parentElSelector, childElSelector)
{

   this.parentElSelector = parentElSelector;
   this.childElSelector = childElSelector;
   this.listbox = document.querySelector(this.parentElSelector);
   this.listboxItems = this.listbox.querySelectorAll(this.childElSelector);
   this.IDREF = this.listbox.getAttribute("aria-activedescendant");
   this.itemsLen = this.listboxItems.length;
   function noTabbableItems()
   {
      for (var i = 0; i < this.itemsLen; i++)
      {
         this.listboxItems[i].tabIndex = -1;
      }
   }

   noTabbableItems();

   this.getElement = function(){
      return this.listbox;
   }


   this.getFocusElem = function(){
   return document.getElementById(this.IDREF);
}
   this.getFocusedIndex = function ()
   {
      var num = -1;
      var currentlyFocused = document.getElementById(this.IDREF);

      for (var i = 0; i < this.itemsLen; i++)
      {
         if (this.listboxItems[i] === currentlyFocused)
         {
            num = i;
            break;
         }
      }
      return num;
   }


   this.focusElem = function (elem)
   {
      var currentlyFocused = document.getElementById(this.IDREF);
      if (currentlyFocused !== null)
      {
         currentlyFocused.removeAttribute("id");
      }
      elem.setAttribute("id", this.IDREF);
   }

   this.onFocus = function (e)
   {
      e.preventDefault();
      var selItems = this.listbox.querySelectorAll("[aria-selected='true']");
      if (selItems.length > 0)
      {
         this.focusElem(selItems[0]);
      } else
      {
         console.log(this.listboxItems[0])
         this.focusElem(this.listboxItems[0]);
      }

   }

   this.onFocusEnd = function (e)
   {
      var currentlyFocused = document.getElementById(this.IDREF);
      currentlyFocused.removeAttribute("id");
   }

   // add listeners to the parent element
   /*****************************************/
   //NOTE: this doesn't work: you need to fix this - look to the example here :
   // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/' default to focus in and focus out,
   // but if they aren't supported by whatever bbrowser, fallback to focus and blur
   if (typeof this.listbox.onfocusin !== 'undefined')
   {
      this.listbox.addEventListener("focusin", this.onFocus.bind(this));
   } else
   {
      this.listbox.addEventListener("focus", this.onFocus.bind(this));
   }

   if (typeof this.listbox.onfocusout !== 'undefined')
   {
      this.listbox.addEventListener("focusout", this.onFocusEnd.bind(this));
   } else
   {
      this.listbox.addEventListener("blur", this.onFocusEnd.bind(this));
   }


   this.listbox.addEventListener("keydown", function (e)
   {
      if (e.keyCode === 37 || e.keyCode === 38)
      { /*LEFT or UP*/
         var ind = this.getFocusedIndex();
         e.preventDefault();
         if (ind > 0)
         {
            ind -= 1;
         } else
         {
            ind = 0;
         }
         this.focusElem(this.listboxItems[ind]);
      } else if (e.keyCode === 39 || e.keyCode === 40)
      { /*RIGHT or DOWN*/
         e.preventDefault();
         var ind = this.getFocusedIndex();
         if (ind < this.itemsLen - 1)
         {
            ind += 1;
         }
         this.focusElem(this.listboxItems[ind]);

      } else if (e.keyCode === 32)
      { /*SPACEBAR*/
         e.preventDefault();
         var currentlyFocused = document.getElementById(this.IDREF);
         var toggleVal = currentlyFocused.getAttribute('aria-selected') === "false" ? "true" : "false";
         currentlyFocused.setAttribute("aria-selected", toggleVal);

      }
   }.bind(this));

   this.listbox.addEventListener("mousedown", function (e)
   {
      var currentlyFocused;
      if (e.target.className.indexOf(this.childElSelector) > -1)
      {
         currentlyFocused = e.target;
         var toggleVal = currentlyFocused.getAttribute('aria-selected') === "false" ? "true" : "false";
         currentlyFocused.setAttribute("aria-selected", toggleVal);
         this.focusElem(currentlyFocused)
      } else if(e.target.parentElement.className.indexOf(this.childElSelector) > -1)
      {
         currentlyFocused = e.target.parentElement;
         var toggleVal = currentlyFocused.getAttribute('aria-selected') === "false" ? "true" : "false";
         currentlyFocused.setAttribute("aria-selected", toggleVal);
         this.focusElem(currentlyFocused)
      }
   }.bind(this));
}

