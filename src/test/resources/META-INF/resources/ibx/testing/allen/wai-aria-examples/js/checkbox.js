/**
 * Created by aw14286 on 9/18/2017.
 */
(function ()
{
   console.log("checkbose")
   var checkboxes = document.querySelectorAll("[role='checkbox']");

   function registerListeners()
   {
      for (var i = 0; i < checkboxes.length; i++)
      {
         checkboxes[i].addEventListener("click", onSelect);
         checkboxes[i].addEventListener("SPACE", onSelect);
      }
   }

   registerListeners();

   function onSelect(e)
   {
      e.preventDefault();
      var curr = e.currentTarget
      var newVal = (curr.getAttribute("aria-checked") === "false") ? "true" : "false";
      curr.setAttribute("aria-checked", newVal);

   }
})();