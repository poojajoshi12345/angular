/**
 * Created by aw14286 on 9/8/2017.
 */
(function ()
{
   var tablist = document.querySelectorAll('[role="tablist"]')[0];
   var tabs = document.querySelectorAll('[role="tab"]');
   var panels = document.querySelectorAll('[role="tabpanel"]');

   var keys = {
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46
   };

   // Add or substract depenign on key pressed
   var direction = {
      37: -1,
      38: -1,
      39: 1,
      40: 1
   };

   // Bind listeners
   for (i = 0; i < tabs.length; ++i)
   {
      addListeners(i);
   }
   ;

   function addListeners(index)
   {
      tabs[index].addEventListener('click', clickEventListener);
      //tabs[index].addEventListener('keydown', keydownEventListener);
      tabs[index].addEventListener('LEFT', left);
      tabs[index].addEventListener('RIGHT', right);
      // Build an array with all tabs (<button>s) in it
      tabs[index].index = index;
   };

   function clickEventListener(event)
   {
      var tab = event.target;
      activateTab(tab, false);
   };

   function left(e)
   {
      console.log("detected the left keypress on ")
      console.log(e.target)
      var tabIndex = Array.from(tabs)
                          .indexOf(e.target);
      var tab;
      if (tabIndex == 0)
      {
         tab = tabs[tabs.length - 1];
      } else
      {
         tab = tabs[tabIndex - 1];
      }
      activateTab(tab, true);
   }

   function right(event)
   {
      console.log("detected the right keypress on ")
      console.log(event.target)
      var tabIndex = Array.from(tabs)
                          .indexOf(event.target);
      var tab;

      if (tabIndex === tabs.length - 1)
      {
         tab = tabs[0];
      } else
      {
         tab = tabs[tabIndex + 1]
      }
      activateTab(tab, true);
   }

   // Activates any given tab panel
   function activateTab(tab, setFocus)
   {
      setFocus = setFocus || true;
      // Deactivate all other tabs
      deactivateTabs();

      // Remove tabindex attribute
      //tab.removeAttribute('tabindex');
      tab.setAttribute('tabindex', '0');

      // Set the tab as selected
      tab.setAttribute('aria-selected', 'true');

      // Get the value of aria-controls (which is an ID)
      var controls = tab.getAttribute('aria-controls');

      // Remove hidden attribute from tab panel to make it visible
      document.getElementById(controls)
              .setAttribute('aria-hidden', "false");

      // Set focus when required
      if (setFocus)
      {
         tab.focus();
      }
      ;
   };

   function deactivateTabs()
   {
      for (t = 0; t < tabs.length; t++)
      {
         tabs[t].setAttribute('tabindex', '-1');
         tabs[t].setAttribute('aria-selected', 'false');
         //tabs[t].removeEventListener('focus', focusEventHandler);
      }
      ;

      for (p = 0; p < panels.length; p++)
      {
         panels[p].setAttribute('aria-hidden', 'true');
      }
      ;
   };

})();