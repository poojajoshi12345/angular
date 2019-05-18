/**
 * Created by aw14286 on 9/8/2017.
 */
function toggleModalDialog(event)
{
   var dialog = document.getElementById("d-ex");
   if (event.type === "click" || event.keyCode === 32 || event.keyCode === 13)
   {
      var newVal = dialog.getAttribute("aria-hidden") === 'false';
      dialog.setAttribute("aria-hidden", newVal);
      var overlay = document.getElementsByClassName("overlay")[0];
      overlay.style.display = "initial";
      var childnodes = dialog.querySelectorAll("[role='button']");
      for (var i = 0; i < childnodes.length; i++)
      {
         childnodes[i].setAttribute("tabindex", 0);
      }
      // when the modal is opened,focus on an element in the modal
      var modalBtn = document.getElementById("div-btn-modal");
      modalBtn.focus();
   } else
   {
      modalEscape(null);
   }
}

function modalClose(event)
{
   if (event.type === 'click' || event.keyCode === 32 || event.keyCode === 13)
   {
      modalEscape(null);
   }
}

/**
 * listener to close the modal
 */
function modalEscape(event)
{
   if (event === null || event.keyCode === 27)
   {
      var dialog = document.getElementById("d-ex");
      dialog.setAttribute("aria-hidden", true);
      document.getElementsByClassName("overlay")[0].style.display = "none";
      var childnodes = dialog.querySelectorAll("[role='button']");
      for (var i = 0; i < childnodes.length; i++)
      {
         childnodes[i].setAttribute("tabindex", -1);
      }
   }
}

/**
 * function to redirect the focus within the dialog instead of bouncing outside
 * @param event
 */
function modalTabRedirect(event)
{
   console.log(event.keyCode)
   if (event.keyCode === 9)
   {
      event.preventDefault();
      var modalBtn = document.getElementById("div-btn-modal");
      modalBtn.focus();
   }
}