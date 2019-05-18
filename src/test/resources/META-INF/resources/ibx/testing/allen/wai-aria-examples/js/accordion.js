(function ()
{
   // the accordion has the role ' presentation'
   var accordionHolder = document.querySelector("div#accordionGroup");
   var accordionButtons = accordionHolder.querySelectorAll(".Accordion-trigger");
   var accordionHeaders = accordionHolder.querySelectorAll("[role='header']");

   function registerButtonListeners()
   {
      for (var i = 0; i < accordionButtons.length; i++)
      {
         accordionButtons[i].addEventListener("click", onSelect)
         accordionButtons[i].addEventListener("ENTER", onSelect)
         accordionButtons[i].addEventListener("UP", onUp);
         accordionButtons[i].addEventListener("DOWN", onDown);
      }
   }

   registerButtonListeners();

   function registerHeaderListeners()
   {
      for (var i = 0; i < accordionHeaders.length; i++)
      {
         accordionHeaders[i].addEventListener("UP", onUp);
      }
   }

   registerHeaderListeners();

   function onUp(e)
   {
      e.preventDefault()
      if (Array.from(accordionButtons)
               .indexOf(e.currentTarget) > -1)
      {
         var len = accordionButtons.length - 1;
         var curr;
         for (var i = 0; i <= len; i++)
         {
            if (e.currentTarget === accordionButtons[i])
            {
               curr = i;
            }
         }
         if (curr === 0)
         {
            accordionButtons[len].focus();
         } else
         {
            accordionButtons[curr - 1].focus();
         }
      }

   }

   function onDown(e)
   {
      e.preventDefault();
      if (Array.from(accordionButtons)
               .indexOf(e.currentTarget) > -1)
      {
         var len = accordionButtons.length - 1;
         var curr;
         for (var i = 0; i <= len; i++)
         {
            if (e.currentTarget === accordionButtons[i])
            {
               curr = i;
            }
         }
         if (curr === len)
         {
            accordionButtons[0].focus();
         } else
         {
            accordionButtons[curr + 1].focus();
         }
      }

   }

   function onHome(e)
   {
      e.preventDefault();
      if (Array.from(accordionButtons)
               .indexOf(e.currentTarget) > -1)
      {
         accordionButtons[0].focus();
      }

   }

   function onEnd(e)
   {
      e.preventDefault();
      if (Array.from(accordionButtons)
               .indexOf(e.currentTarget) > -1)
      {
         accordionButtons[len].focus();
      }

   }

   function onSelect(e)
   {
      openAccordion(e);
      e.preventDefault();
   }

   function closeAccordions()
   {
      for (var i = 0; i < accordionButtons.length; i++)
      {
         var controlledElem = accordionButtons[i].getAttribute("aria-controls");
         document.getElementById(controlledElem)
                 .setAttribute("aria-hidden", "true");
      }
   }

   function openAccordion(e)
   {
      console.log("opening accordion")
      var currButton = e.currentTarget;
      var toOpen = currButton.getAttribute("aria-controls");
      var currPanel = document.getElementById(toOpen);
      var shouldOpen = currPanel.getAttribute("aria-hidden") === "true";

      closeAccordions();

      if (shouldOpen)
      {
         currPanel.setAttribute("aria-hidden", "false");
      }

   }
})();