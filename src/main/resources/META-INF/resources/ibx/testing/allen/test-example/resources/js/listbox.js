/**
 * Created by aw14286 on 9/22/2017.
 */
function parentListbox()
{
   var leftCtrl = new ListBoxElement(".left-box", ".ak-list-items");
   var rightCtrl = new ListBoxElement(".right-box", ".ak-list-items");
   var addbtn = document.querySelector(".addbtn");
   var removebtn = document.querySelector(".removebtn");

   var listBoxController = document.querySelector("#listbox-outer");

   this.setFocusTo = function (elem)
   {
      elem.setAttribute("tabindex", "0")
      elem.focus()
      elem.setAttribute("tabindex", "-1");
   }

   listBoxController.addEventListener("focus", function (e)
   {
      e.preventDefault();
      this.setFocusTo(leftCtrl.getElement());
   }.bind(this));

   listBoxController.addEventListener("keydown", function (e)
   {
      if (e.keyCode === 9 && e.shiftKey)
      {
         if (document.activeElement === leftCtrl.getElement())
         {
            // focus the element that's supposed to be focused before the listbox
            listBoxController.setAttribute("tabindex", "-1");
            setTimeout(function ()
            {
               listBoxController.setAttribute("tabindex", "0");
            }.bind(this));
         } else if (document.activeElement === addbtn)
         {
            e.preventDefault();
            this.setFocusTo(leftCtrl.getElement());
         } else if (document.activeElement === rightCtrl.getElement())
         {
            e.preventDefault();
            this.setFocusTo(addbtn);
         } else
         {
            e.preventDefault();
            this.setFocusTo(rightCtrl.getElement());
         }
      } else if (e.keyCode === 9)
      { // if this is a tab
         // if this is on the active element,
         if (document.activeElement === leftCtrl.getElement())
         {
            e.preventDefault();
            this.setFocusTo(addbtn)
         } else if (document.activeElement === addbtn)
         {
            e.preventDefault();
            this.setFocusTo(rightCtrl.getElement());
         } else if (document.activeElement === rightCtrl.getElement())
         {
            e.preventDefault();
            this.setFocusTo(removebtn);
         } else
         {
            // tyhis must be the removebtn
            // do nothing
         }

      }
   }.bind(this));

   addbtn.addEventListener("keydown", function (e)
   {
      if (e.keyCode === 13)
      {
         e.preventDefault();
         var elemToMove = leftCtrl.getElement().querySelectorAll('[aria-selected="true"]');
      for (var i = 0; i < elemToMove.length; i++)
         {
            elemToMove[i].setAttribute("aria-selected", "false");
            rightCtrl.getElement().querySelector(".listbox-middle-elem").appendChild(elemToMove[i]);
         }
      }
   }.bind(this));


   removebtn.addEventListener("keydown", function (e)
   {
      if (e.keyCode === 13)
      {
         e.preventDefault();
         var elemToMove = rightCtrl.getElement().querySelectorAll('[aria-selected="true"]');
         for (var i = 0; i < elemToMove.length; i++)
         {
            elemToMove[i].setAttribute("aria-selected", "false");
            leftCtrl.getElement().querySelector(".listbox-middle-elem").appendChild(elemToMove[i]);
         }
      }
   }.bind(this));
}

parentListbox();