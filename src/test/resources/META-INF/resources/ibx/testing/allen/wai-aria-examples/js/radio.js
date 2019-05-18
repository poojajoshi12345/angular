/**
 * Created by aw14286 on 9/18/2017.
 */
(function ()
{

   var radioGroups = document.querySelectorAll("[role='radiogroup']");

   // function to get the index of an element in a NodeList
   var index = function (el)
   {
      var children = el.parentNode.children,
          i = 0;
      for (; i < children.length; i++)
      {
         if (children[i] == el)
         {
            return i;
         }
      }
      return -1;
   };

   function registerListeners()
   {
      for (var i = 0; i < radioGroups.length; i++)
      {
         for (var j = 0; j < radioGroups[i].children.length; j++)
         {
            var currRadio = radioGroups[i].children[j];
            currRadio.addEventListener("click", onSelect);
            currRadio.addEventListener("SPACE", onSelect);
            currRadio.addEventListener("UP", onUp);
            currRadio.addEventListener("DOWN", onDown);

         }
      }
   }

   registerListeners();

   function onSelect(e)
   {
      var radioBtn = e.currentTarget;
      if (radioBtn.getAttribute("aria-checked") === "false")
      {
         for (var i = 0; i < radioBtn.parentNode.children.length; i++)
         {
            var r = radioBtn.parentNode.children[i];
            r.setAttribute("aria-checked", "false");
            r.setAttribute("tabindex", -1);
         }

          radioBtn.setAttribute("aria-checked", "true");
          radioBtn.setAttribute("tabindex", 0);
      }
   }


   function onDown(e)
   {
      var radioButton = e.currentTarget;
      var radioGroup = radioButton.parentNode;

      var radioIndex = index(radioButton);
      if (radioIndex === radioGroup.children.length - 1)
      {
         radioGroup.children[0].focus();
      } else
      {
         radioGroup.children[radioIndex + 1].focus();
      }
   }

   function onUp(e)
   {
      var radioButton = e.currentTarget;
      var radioGroup = radioButton.parentNode;

      var radioIndex = index(radioButton);
      if (radioIndex === 0)
      {
         radioGroup.children[radioGroup.children.length - 1].focus();
      } else
      {
         radioGroup.children[radioIndex - 1].focus();
      }
   }
})()